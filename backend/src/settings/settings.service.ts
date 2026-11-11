import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  getAllSettings() {
    return this.prisma.memDb.systemSettings;
  }

  getSettingsByCategory(category: string) {
    return this.prisma.memDb.systemSettings.filter(
      (s) => s.category.toUpperCase() === category.toUpperCase(),
    );
  }

  updateSetting(key: string, value: string, actor: string = 'Super Admin') {
    const setting = this.prisma.memDb.systemSettings.find((s) => s.key === key);
    if (!setting) {
      throw new BadRequestException(`Setting with key "${key}" not found.`);
    }

    const oldValue = setting.value;
    setting.value = value;

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'SYSTEM_SETTING_CHANGED',
      targetResource: `Setting ${key}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { key, oldValue, newValue: value },
    });

    return {
      success: true,
      setting,
      message: `System setting "${key}" updated successfully.`,
    };
  }
}
