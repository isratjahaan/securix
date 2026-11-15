import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { SocModule } from './soc/soc.module';
import { ModulesCenterModule } from './modules-center/modules.module';
import { PhishingModule } from './phishing/phishing.module';
import { RansomwareModule } from './ransomware/ransomware.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { DevicesModule } from './devices/devices.module';
import { AssetsModule } from './assets/assets.module';
import { ThreatIntelModule } from './threat-intel/threat-intel.module';
import { ForensicsModule } from './forensics/forensics.module';
import { VaultModule } from './vault/vault.module';
import { BackupsModule } from './backups/backups.module';
import { AuditModule } from './audit/audit.module';
import { ReportsModule } from './reports/reports.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { HealthModule } from './health/health.module';
import { SearchModule } from './search/search.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    AuthModule,
    SocModule,
    ModulesCenterModule,
    PhishingModule,
    RansomwareModule,
    DashboardModule,
    UsersModule,
    AdminsModule,
    DevicesModule,
    AssetsModule,
    ThreatIntelModule,
    ForensicsModule,
    VaultModule,
    BackupsModule,
    AuditModule,
    ReportsModule,
    IntegrationsModule,
    HealthModule,
    SearchModule,
    SettingsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
