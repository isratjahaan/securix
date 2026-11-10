let currentDeviceId = 'SEC-ALPHA-01';
let map, marker, accuracyCircle;
let eventSource;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initSSE();
});

function initMap() {
    // Center initially on default coordinates (San Francisco or 0,0)
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([37.7749, -122.4194], 14);

    // Dark cyberpunk map tiles (CartoDB DarkMatter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Custom Glowing Emerald Marker
    const emeraldIcon = L.divIcon({
        className: 'custom-emerald-pin',
        html: `
            <div style="
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #20E88A;
                border: 3px solid #080D18;
                box-shadow: 0 0 16px #20E88A;
                animation: pulse-emerald 2s infinite;
            "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    marker = L.marker([37.7749, -122.4194], { icon: emeraldIcon }).addTo(map);
    accuracyCircle = L.circle([37.7749, -122.4194], {
        radius: 100,
        color: '#00D9C5',
        fillColor: '#00D9C5',
        fillOpacity: 0.15,
        weight: 1
    }).addTo(map);
}

function updateMapLocation(lat, lng, accuracy) {
    if (!map || !marker) return;
    const newLatLng = [lat, lng];
    marker.setLatLng(newLatLng);
    if (accuracyCircle) {
        accuracyCircle.setLatLng(newLatLng);
        accuracyCircle.setRadius(accuracy || 50);
    }
    map.panTo(newLatLng);

    document.getElementById('gpsReadout').textContent =
        `LAT: ${lat.toFixed(6)} • LNG: ${lng.toFixed(6)} (Acc: ${(accuracy || 0).toFixed(1)}m)`;
}

function initSSE() {
    eventSource = new EventSource('/api/events');

    eventSource.addEventListener('initial_state', (e) => {
        const data = JSON.parse(e.data);
        if (data.devices && data.devices.length > 0) {
            updateDeviceTelemetry(data.devices[0]);
        }
        if (data.audit) {
            renderAuditTable(data.audit);
        }
        if (data.intruders) {
            renderIntruders(data.intruders);
        }
    });

    eventSource.addEventListener('device_update', (e) => {
        const device = JSON.parse(e.data);
        if (device.deviceId === currentDeviceId) {
            updateDeviceTelemetry(device);
        }
    });

    eventSource.addEventListener('command_dispatched', (e) => {
        const cmd = JSON.parse(e.data);
        appendAuditRow(cmd);
    });

    eventSource.addEventListener('command_status', (e) => {
        const status = JSON.parse(e.data);
        updateAuditRowStatus(status.commandId, status.status, status.resultMessage);
    });

    eventSource.addEventListener('intruder_alert', (e) => {
        const alert = JSON.parse(e.data);
        prependIntruderAlert(alert);
    });

    eventSource.onerror = (err) => {
        console.warn('SSE connection interrupted, retrying in 5s...', err);
    };
}

function updateDeviceTelemetry(dev) {
    currentDeviceId = dev.deviceId;
    document.getElementById('kpiDeviceName').textContent = dev.deviceName || 'Android Device';
    document.getElementById('kpiDeviceId').textContent = `ID: ${dev.deviceId}`;
    document.getElementById('kpiBattery').textContent = `${dev.batteryLevel}% ${dev.isCharging ? '⚡ Charging' : '🔋 Discharging'}`;
    document.getElementById('kpiNetwork').textContent = dev.networkType || 'CELLULAR/WIFI';

    const modeLabel = dev.isDeviceOwner ? 'MODE B: DEVICE OWNER' : 'MODE A: STANDARD';
    document.getElementById('kpiMode').textContent = modeLabel;

    if (dev.latitude && dev.longitude) {
        updateMapLocation(dev.latitude, dev.longitude, dev.accuracy);
    }
}

async function dispatchCommand(type, payload = '') {
    try {
        const response = await fetch('/api/command/dispatch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deviceId: currentDeviceId,
                type: type,
                payload: payload
            })
        });
        const result = await response.json();
        if (result.success) {
            showToast(`Command ${type} dispatched successfully! (ID: ${result.commandId})`);
        } else {
            alert('Failed to dispatch command: ' + result.error);
        }
    } catch (e) {
        alert('Network error: ' + e.message);
    }
}

function renderAuditTable(list) {
    const tbody = document.getElementById('auditTableBody');
    tbody.innerHTML = '';
    list.slice().reverse().forEach(cmd => {
        appendAuditRow(cmd, false);
    });
}

function appendAuditRow(cmd, prepend = true) {
    const tbody = document.getElementById('auditTableBody');
    const tr = document.createElement('tr');
    tr.id = `row-${cmd.commandId}`;

    const dateStr = new Date(cmd.timestamp).toLocaleTimeString();
    const statusClass = (cmd.status || 'PENDING').toLowerCase();

    tr.innerHTML = `
        <td><strong style="color:var(--accent-cyan)">${cmd.commandId}</strong></td>
        <td>${cmd.type}</td>
        <td><span class="status-badge ${statusClass}" id="badge-${cmd.commandId}">${cmd.status}</span></td>
        <td>${dateStr}</td>
        <td id="msg-${cmd.commandId}" style="color:var(--text-muted)">${cmd.resultMessage || 'Dispatched to queue'}</td>
    `;

    if (prepend && tbody.firstChild) {
        tbody.insertBefore(tr, tbody.firstChild);
    } else {
        tbody.appendChild(tr);
    }
}

function updateAuditRowStatus(commandId, status, message) {
    const badge = document.getElementById(`badge-${commandId}`);
    if (badge) {
        badge.className = `status-badge ${status.toLowerCase()}`;
        badge.textContent = status;
    }
    const msgEl = document.getElementById(`msg-${commandId}`);
    if (msgEl && message) {
        msgEl.textContent = message;
        msgEl.style.color = status === 'EXECUTED' ? 'var(--primary-emerald)' : 'var(--danger-red)';
    }
}

function renderIntruders(alerts) {
    const gallery = document.getElementById('intruderGallery');
    document.getElementById('intruderCount').textContent = `${alerts.length} Captured`;

    if (alerts.length === 0) {
        gallery.innerHTML = '<div class="empty-state">No intrusion attempts recorded. Perimeter secure.</div>';
        return;
    }

    gallery.innerHTML = '';
    alerts.forEach(alert => {
        prependIntruderAlert(alert, false);
    });
}

function prependIntruderAlert(alert, prepend = true) {
    const gallery = document.getElementById('intruderGallery');
    const emptyState = gallery.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    const card = document.createElement('div');
    card.className = 'intruder-card';

    const photoSrc = alert.photoBase64 ? `data:image/jpeg;base64,${alert.photoBase64}` : '/public/securix_logo.jpg';
    const timeStr = new Date(alert.timestamp).toLocaleTimeString();

    card.innerHTML = `
        <img src="${photoSrc}" alt="Intruder Mugshot" class="intruder-thumb">
        <div class="intruder-info">
            <div class="intruder-reason">🚨 ${alert.triggerReason} (${alert.failedAttempts || 1} Fails)</div>
            <div class="intruder-time">Time: ${timeStr}</div>
            <div class="intruder-coords">GPS: ${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}</div>
        </div>
    `;

    if (prepend && gallery.firstChild) {
        gallery.insertBefore(card, gallery.firstChild);
    } else {
        gallery.appendChild(card);
    }

    const currentCount = gallery.querySelectorAll('.intruder-card').length;
    document.getElementById('intruderCount').textContent = `${currentCount} Captured`;
}

// Modal controls
function openLostMessageModal() {
    document.getElementById('lostModal').classList.add('active');
}

function closeLostModal() {
    document.getElementById('lostModal').classList.remove('active');
}

function dispatchLostMode() {
    const text = document.getElementById('lostMsgInput').value;
    closeLostModal();
    dispatchCommand('LOST_MODE', text);
}

function confirmRemoteWipe() {
    const confirmed = confirm(
        "CRITICAL WARNING: This will permanently erase all data, wipe internal storage, and factory reset the device. Are you sure you wish to proceed?"
    );
    if (confirmed) {
        const pin = prompt("Enter your master 4-digit security PIN to authorize remote wipe:");
        if (pin) {
            dispatchCommand('WIPE_DATA', pin);
        }
    }
}

function copyAdbCommand() {
    const cmd = "adb shell dpm set-device-owner com.securix.security/.receiver.SecurixDeviceAdminReceiver";
    navigator.clipboard.writeText(cmd).then(() => {
        showToast("ADB command copied to clipboard!");
    });
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = '#162238';
    toast.style.color = '#20E88A';
    toast.style.border = '1px solid #20E88A';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '13px';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
    toast.style.zIndex = '9999';
    toast.textContent = msg;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}
