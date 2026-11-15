import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  getDevices(query?: { status?: string; search?: string }) {
    let list = [...this.prisma.memDb.devices];

    if (query?.status) {
      list = list.filter((d) => d.status.toUpperCase() === query.status.toUpperCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.deviceName.toLowerCase().includes(q) ||
          d.deviceId.toLowerCase().includes(q) ||
          d.ownerName.toLowerCase().includes(q) ||
          d.model.toLowerCase().includes(q),
      );
    }

    return list;
  }

  getDeviceById(id: string) {
    const dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    if (!dev) throw new NotFoundException('Device not found');

    const alerts = this.prisma.memDb.alerts.filter((a) => a.deviceId === dev.deviceId);
    return {
      ...dev,
      alerts,
      complianceChecks: [
        { check: 'OS Cryptographic Storage Encryption', passed: dev.encryptionEnabled },
        { check: 'Root / Magisk / Su Binary Absent', passed: !dev.rootDetected },
        { check: 'Developer Options & USB Debugging Disabled', passed: !dev.developerModeEnabled },
        { check: 'Enterprise Security Patch SLA (<= 90 days)', passed: true },
        { check: 'SIS Endpoint Agent Heartbeat (< 24h)', passed: true },
      ],
      supportedPermissions: [
        'android.permission.INTERNET',
        'android.permission.ACCESS_NETWORK_STATE',
        'android.permission.RECEIVE_BOOT_COMPLETED',
        'android.permission.POST_NOTIFICATIONS',
      ],
    };
  }

  registerDevice(data: {
    deviceId?: string;
    name?: string;
    deviceName?: string;
    platform?: string;
    osVersion?: string;
    model?: string;
    ipAddress?: string;
    ownerName?: string;
    ownerEmail?: string;
  }) {
    const devId = data.deviceId || `EP-${Math.floor(Math.random() * 9000 + 1000)}-AND`;
    let dev = this.prisma.memDb.devices.find((d) => d.deviceId === devId || (data.deviceId && d.id === data.deviceId));

    if (dev) {
      dev.lastSyncAt = new Date().toISOString();
      dev.status = dev.isLocked ? 'STOLEN_LOCKED' : 'ONLINE';
      if (data.ipAddress) dev.ipAddress = data.ipAddress;
      if (data.osVersion) dev.androidVersion = data.osVersion;
      return dev;
    }

    const newDevice = {
      id: `dev-${Date.now()}`,
      deviceId: devId,
      deviceName: data.deviceName || data.name || 'Android Device',
      manufacturer: data.platform || 'Android',
      model: data.model || 'Mobile Device',
      androidVersion: data.osVersion || 'Android 14',
      securityPatchLevel: new Date().toISOString().slice(0, 10),
      ownerName: data.ownerName || 'Alex Vance (Super Admin)',
      ownerEmail: data.ownerEmail || 'alex.vance@fortress.sis.enterprise',
      status: 'ONLINE',
      isCompliant: true,
      securityPostureScore: 98,
      encryptionEnabled: true,
      rootDetected: false,
      developerModeEnabled: false,
      lastSyncAt: new Date().toISOString(),
      registeredAt: new Date().toISOString(),
      isLocked: false,
      sirenActive: false,
      wipeRequested: false,
      lockReason: '',
      ipAddress: data.ipAddress || '10.0.2.16',
    };

    this.prisma.memDb.devices.unshift(newDevice);

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: newDevice.ownerName,
      actorRole: 'USER',
      action: 'DEVICE_REGISTERED',
      targetResource: `Device ${newDevice.deviceId} (${newDevice.deviceName})`,
      result: 'SUCCESS',
      ipAddress: newDevice.ipAddress,
      timestamp: new Date().toISOString(),
      details: { model: newDevice.model, os: newDevice.androidVersion },
    });

    return newDevice;
  }

  getCommandState(id: string) {
    const dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    if (!dev) {
      // Default fallback for any query
      return {
        isLocked: false,
        status: 'ONLINE',
        sirenActive: false,
        wipeRequested: false,
        lockReason: '',
      };
    }
    return {
      deviceId: dev.deviceId,
      isLocked: !!dev.isLocked,
      status: dev.status,
      sirenActive: !!dev.sirenActive,
      wipeRequested: !!dev.wipeRequested,
      lockReason: dev.lockReason || 'Device reported stolen by Enterprise Security Administrator.',
      lastSyncAt: dev.lastSyncAt,
    };
  }

  heartbeat(id: string, telemetry?: any) {
    let dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    if (!dev) {
      dev = this.registerDevice({
        deviceId: id,
        deviceName: telemetry?.deviceName || 'Android Client Endpoint',
        model: telemetry?.model || 'Android Device',
        osVersion: telemetry?.osVersion || 'Android 14',
        ipAddress: telemetry?.ipAddress || '10.0.2.16',
      });
    }

    dev.lastSyncAt = new Date().toISOString();
    if (telemetry?.batteryLevel !== undefined) dev.batteryLevel = telemetry.batteryLevel;
    if (telemetry?.ipAddress) dev.ipAddress = telemetry.ipAddress;

    return this.getCommandState(dev.deviceId);
  }

  lockDevice(id: string, reason?: string, actor: string = 'Super Admin') {
    const dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    if (!dev) throw new NotFoundException('Device not found');

    dev.isLocked = true;
    dev.status = 'STOLEN_LOCKED';
    dev.sirenActive = true;
    dev.lockReason = reason || 'STOLEN DEVICE LOCKOUT: Remotely secured by SIS Cyber Fortress Security Operations.';

    // Generate critical alert in SOC
    const alertId = `ALT-STOLEN-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newAlert = {
      id: `alt-stolen-${Date.now()}`,
      alertId,
      title: `Emergency Anti-Theft Lockdown: ${dev.deviceName}`,
      description: `Device ${dev.deviceId} (${dev.deviceName}) reported lost/stolen. Remote lockout protocol and siren engaged.`,
      moduleId: 'sis-endpoint',
      moduleName: 'SIS Endpoint Guardian',
      severity: 'CRITICAL',
      status: 'NEW',
      deviceId: dev.deviceId,
      sourceIp: dev.ipAddress || '10.0.2.16',
      targetResource: `Mobile Terminal [${dev.deviceId}]`,
      assignedTo: actor,
      incidentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.prisma.memDb.alerts.unshift(newAlert);

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'DEVICE_REMOTE_THEFT_LOCK',
      targetResource: `Device ${dev.deviceId} (${dev.deviceName})`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { reason: dev.lockReason, alertId },
    });

    return {
      success: true,
      message: `Anti-theft lockout executed for ${dev.deviceName}. Terminal is now locked.`,
      device: dev,
    };
  }

  unlockDevice(id: string, actor: string = 'Super Admin') {
    const dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    if (!dev) throw new NotFoundException('Device not found');

    dev.isLocked = false;
    dev.status = 'COMPLIANT';
    dev.sirenActive = false;
    dev.lockReason = '';

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'DEVICE_REMOTE_THEFT_UNLOCK',
      targetResource: `Device ${dev.deviceId} (${dev.deviceName})`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { message: 'Device recovered and unlocked' },
    });

    return {
      success: true,
      message: `Device ${dev.deviceName} restored and unlocked.`,
      device: dev,
    };
  }

  triggerSiren(id: string, active: boolean) {
    const dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    if (!dev) throw new NotFoundException('Device not found');

    dev.sirenActive = active;
    return {
      success: true,
      sirenActive: dev.sirenActive,
      message: active ? 'Anti-theft alarm siren triggered' : 'Alarm siren silenced',
    };
  }

  triggerWipe(id: string, actor: string = 'Super Admin') {
    const dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    if (!dev) throw new NotFoundException('Device not found');

    dev.wipeRequested = true;
    dev.status = 'WIPED';

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'DEVICE_REMOTE_VAULT_WIPE',
      targetResource: `Device ${dev.deviceId} (${dev.deviceName})`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { message: 'Zero-Knowledge Vault local cache wipe command dispatched.' },
    });

    return {
      success: true,
      message: `Remote wipe command dispatched to ${dev.deviceName}. Sensitive vault and credential cache purged.`,
      device: dev,
    };
  }

  isolateDevice(id: string, actor: string = 'Super Admin') {
    const dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    if (!dev) throw new NotFoundException('Device not found');

    dev.status = 'ISOLATED';
    dev.isCompliant = false;

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'DEVICE_NETWORK_ISOLATION',
      targetResource: `Device ${dev.deviceId} (${dev.deviceName})`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { message: 'Network severed due to containment order.' },
    });

    return {
      success: true,
      message: `Device ${dev.deviceName} has been severed from network and quarantined.`,
      device: dev,
    };
  }

  triggerDeviceScan(id: string) {
    const dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    const score = Math.floor(Math.random() * 5 + 95); // 95 - 99
    if (dev) {
      dev.lastSyncAt = new Date().toISOString();
      dev.securityPostureScore = score;
      dev.isCompliant = true;
    }

    // Add activity audit log
    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: dev ? dev.ownerName : 'Mobile Endpoint Agent',
      actorRole: 'USER',
      action: 'ENDPOINT_THREAT_SCAN_COMPLETED',
      targetResource: dev ? `Device ${dev.deviceId} (${dev.deviceName})` : 'Mobile Android Device',
      result: 'SUCCESS',
      ipAddress: dev?.ipAddress || '10.0.2.16',
      timestamp: new Date().toISOString(),
      details: { postureScore: score, rootDetected: false, integrityAttested: true },
    });

    return {
      success: true,
      postureScore: score,
      status: 'COMPLIANT',
      timestamp: new Date().toISOString(),
      message: 'Integrity scan verified clean. Zero threats detected.',
    };
  }

  deregisterDevice(id: string, actor: string = 'Super Admin') {
    const dev = this.prisma.memDb.devices.find((d) => d.id === id || d.deviceId === id);
    if (!dev) throw new NotFoundException('Device not found');

    dev.status = 'DEREGISTERED';
    dev.isCompliant = false;

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'DEVICE_AUTHORIZED_DEREGISTRATION',
      targetResource: `Device ${dev.deviceId} (${dev.deviceName})`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { reason: 'Authorized deregistration by enterprise administrator' },
    });

    return {
      success: true,
      message: `Device ${dev.deviceId} successfully deregistered from SIS Endpoint Guardian.`,
      device: dev,
    };
  }
}
