const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// In-Memory Data Store
const state = {
    devices: new Map(),
    pendingCommands: new Map(), // deviceId -> [commands]
    commandAudit: [],
    intruderAlerts: [],
    sseClients: new Set()
};

// Seed a default device so dashboard has rich initial demonstration state
const defaultDeviceId = "SEC-ALPHA-01";
state.devices.set(defaultDeviceId, {
    deviceId: defaultDeviceId,
    deviceName: "Google Pixel 8 Pro (Secured)",
    batteryLevel: 88,
    isCharging: true,
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 4.2,
    speed: 0.0,
    networkType: "5G ENCRYPTED",
    isArmed: true,
    isDeviceAdmin: true,
    isDeviceOwner: true,
    isAccessibilityEnabled: true,
    isLostMode: false,
    isAlarmActive: false,
    lastSeenTimestamp: Date.now()
});

state.commandAudit.push({
    commandId: "CMD-" + crypto.randomBytes(4).toString('hex').toUpperCase(),
    deviceId: defaultDeviceId,
    type: "SYNC_CONFIG",
    status: "EXECUTED",
    timestamp: Date.now() - 120000,
    resultMessage: "Cryptographic policy sync complete. Device Owner active."
});

function broadcastEvent(type, data) {
    const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of state.sseClients) {
        try {
            client.write(message);
        } catch (e) {
            state.sseClients.delete(client);
        }
    }
}

function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 10 * 1024 * 1024) { // 10MB max for photo uploads
                reject(new Error('Payload too large'));
            }
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

function serveStatic(req, res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.apk': 'application/vnd.android.package-archive'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': data.length,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}

const server = http.createServer(async (req, res) => {
    // Enable CORS for API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 1. Web Dashboard & Static files
    const userAgent = req.headers['user-agent'] || '';
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (pathname === '/m' || pathname === '/mobile' || pathname === '/mobile.html') {
        serveStatic(req, res, path.join(PUBLIC_DIR, 'mobile.html'));
        return;
    }

    if (pathname === '/' || pathname === '/index.html') {
        // Auto-serve mobile dashboard for mobile browsers, desktop dashboard for desktop
        if (isMobileDevice && !parsedUrl.query.desktop) {
            serveStatic(req, res, path.join(PUBLIC_DIR, 'mobile.html'));
            return;
        }
        serveStatic(req, res, path.join(PUBLIC_DIR, 'index.html'));
        return;
    }

    if (pathname.startsWith('/public/')) {
        const relPath = pathname.replace('/public/', '');
        const target = path.join(PUBLIC_DIR, relPath);
        serveStatic(req, res, target);
        return;
    }

    // Direct APK download route
    if (pathname === '/download-apk' || pathname === '/securix-debug.apk') {
        const apkPath = path.join(PUBLIC_DIR, 'securix-debug.apk');
        if (fs.existsSync(apkPath)) {
            res.setHeader('Content-Disposition', 'attachment; filename="securix-debug.apk"');
            serveStatic(req, res, apkPath);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'APK file not yet built' }));
        }
        return;
    }

    // 2. Server-Sent Events (SSE) Stream
    if (pathname === '/api/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write('retry: 5000\n\n');
        state.sseClients.add(res);

        // Send initial full state
        res.write(`event: initial_state\ndata: ${JSON.stringify({
            devices: Array.from(state.devices.values()),
            audit: state.commandAudit.slice(-30),
            intruders: state.intruderAlerts.slice(-20)
        })}\n\n`);

        req.on('close', () => {
            state.sseClients.delete(res);
        });
        return;
    }

    // 3. Device API Endpoints
    if (pathname === '/api/device/heartbeat' && req.method === 'POST') {
        try {
            const data = await parseJsonBody(req);
            data.lastSeenTimestamp = Date.now();
            state.devices.set(data.deviceId, data);

            broadcastEvent('device_update', data);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, timestamp: Date.now() }));
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // Fetch pending commands for device
    const commandMatch = pathname.match(/^\/api\/device\/([^/]+)\/commands$/);
    if (commandMatch && req.method === 'GET') {
        const deviceId = commandMatch[1];
        const pending = state.pendingCommands.get(deviceId) || [];
        state.pendingCommands.set(deviceId, []); // Flush queue after fetch

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(pending));
        return;
    }

    // Device command execution acknowledgment
    if (pathname === '/api/device/command-result' && req.method === 'POST') {
        try {
            const data = await parseJsonBody(req);
            const auditEntry = state.commandAudit.find(c => c.commandId === data.commandId);
            if (auditEntry) {
                auditEntry.status = data.status;
                auditEntry.resultMessage = data.resultMessage;
                auditEntry.completedAt = Date.now();
            } else {
                state.commandAudit.push({
                    commandId: data.commandId,
                    deviceId: data.deviceId,
                    status: data.status,
                    resultMessage: data.resultMessage,
                    completedAt: Date.now()
                });
            }

            broadcastEvent('command_status', data);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // Device intruder alert report
    if (pathname === '/api/device/intruder-alert' && req.method === 'POST') {
        try {
            const data = await parseJsonBody(req);
            data.id = data.id || "ALERT-" + crypto.randomBytes(4).toString('hex').toUpperCase();
            data.timestamp = data.timestamp || Date.now();
            state.intruderAlerts.unshift(data);

            broadcastEvent('intruder_alert', data);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, alertId: data.id }));
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // 4. Dashboard Web Control APIs
    if (pathname === '/api/command/dispatch' && req.method === 'POST') {
        try {
            const data = await parseJsonBody(req);
            const { deviceId, type, payload } = data;

            if (!deviceId || !type) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'deviceId and type required' }));
                return;
            }

            const commandId = "CMD-" + crypto.randomBytes(4).toString('hex').toUpperCase();
            const command = {
                commandId,
                type,
                payload: payload || '',
                timestamp: Date.now(),
                status: 'PENDING',
                signature: crypto.createHmac('sha256', 'securix_auth_secret').update(`${deviceId}:${type}:${Date.now()}`).digest('hex')
            };

            const queue = state.pendingCommands.get(deviceId) || [];
            queue.push(command);
            state.pendingCommands.set(deviceId, queue);

            const auditItem = {
                commandId,
                deviceId,
                type,
                payload,
                status: 'PENDING',
                timestamp: Date.now()
            };
            state.commandAudit.unshift(auditItem);

            broadcastEvent('command_dispatched', auditItem);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, commandId }));
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    if (pathname === '/api/devices' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(Array.from(state.devices.values())));
        return;
    }

    if (pathname === '/api/commands/audit' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(state.commandAudit.slice(-50)));
        return;
    }

    if (pathname === '/api/intruders' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(state.intruderAlerts.slice(-30)));
        return;
    }

    // Default 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
    console.log(`[SECURIX SERVER] Active and listening on http://localhost:${PORT}`);
    console.log(`[SECURIX SERVER] Web Dashboard: http://localhost:${PORT}`);
    console.log(`[SECURIX SERVER] APK Distribution: http://localhost:${PORT}/download-apk`);
});
