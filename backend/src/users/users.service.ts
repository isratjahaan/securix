import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getUsers(query?: { search?: string; status?: string }) {
    let list = [...this.prisma.memDb.users];

    if (query?.status) {
      list = list.filter((u) => u.status === query.status.toUpperCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q),
      );
    }

    return list;
  }

  getUserById(id: string) {
    const user = this.prisma.memDb.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    const userDevices = this.prisma.memDb.devices.filter((d) => d.ownerEmail === user.email);
    const userAuditLogs = this.prisma.memDb.auditLogs.filter((a) => a.targetResource.includes(user.email));

    // Never expose password hashes or sensitive authentication secrets
    const { passwordHash, mfaSecret, ...safeProfile } = user as any;
    return {
      ...safeProfile,
      devices: userDevices,
      auditHistory: userAuditLogs,
    };
  }

  updateUserStatus(id: string, status: string, actor: string = 'Super Admin') {
    const user = this.prisma.memDb.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');

    const validStatuses = ['ACTIVE', 'SUSPENDED', 'LOCKED', 'DEACTIVATED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      throw new BadRequestException('Invalid status: ' + status);
    }

    user.status = status.toUpperCase();

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: `USER_STATUS_${status.toUpperCase()}`,
      targetResource: `User ${user.email}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { previousStatus: user.status, newStatus: status },
    });

    return user;
  }

  revokeUserSessions(id: string, actor: string = 'Super Admin') {
    const user = this.prisma.memDb.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'USER_SESSIONS_REVOKED',
      targetResource: `User ${user.email}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { allSessionsTerminated: true },
    });

    return { success: true, message: `All active sessions revoked for ${user.fullName}.` };
  }

  exportUsersCsv() {
    const users = this.prisma.memDb.users;
    const headers = 'ID,Full Name,Email,Username,Status,MFA Enabled,Role,Created At\n';
    const rows = users
      .map(
        (u) =>
          `"${u.id}","${u.fullName}","${u.email}","${u.username}","${u.status}",${u.mfaEnabled},"${u.adminRoleType || 'User'}","${u.createdAt}"`,
      )
      .join('\n');
    return headers + rows;
  }
}
