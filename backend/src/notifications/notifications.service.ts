import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  getUnreadNotifications() {
    const list = [
      {
        id: 'notif-1',
        title: 'Critical Threat Detected',
        message: 'Brute force credential stuffing detected across 34 IPs targeting Identity Guardian.',
        severity: 'CRITICAL',
        createdAt: '2 mins ago',
        isRead: false,
      },
      {
        id: 'notif-2',
        title: 'Android Endpoint Policy Violation',
        message: 'Device Galaxy-S24 (ID: EP-7801) detected developer mode & unapproved debugging.',
        severity: 'HIGH',
        createdAt: '14 mins ago',
        isRead: false,
      },
      {
        id: 'notif-3',
        title: 'Cloud Backup Integrity Verified',
        message: 'Daily encrypted snapshot job for SIS Vault Guardian passed SHA-256 verification.',
        severity: 'INFORMATIONAL',
        createdAt: '1 hour ago',
        isRead: true,
      },
    ];

    return {
      unreadCount: list.filter((n) => !n.isRead).length,
      data: list,
    };
  }

  markAllRead() {
    return { success: true, message: 'All notifications marked as read.' };
  }

  getPreferences() {
    return [
      { channel: 'IN_APP', criticalAlerts: true, incidentUpdates: true, backupFailures: true, systemHealthDegraded: true },
      { channel: 'PUSH_FCM', criticalAlerts: true, incidentUpdates: true, backupFailures: true, systemHealthDegraded: false },
      { channel: 'EMAIL', criticalAlerts: true, incidentUpdates: false, backupFailures: true, systemHealthDegraded: false },
    ];
  }
}
