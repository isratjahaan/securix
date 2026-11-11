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
