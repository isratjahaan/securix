import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('System Settings & Security Policies')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all categorized enterprise system settings' })
  getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @Get(':category')
  @ApiOperation({ summary: 'Get settings filtered by category (GENERAL, SECURITY, NOTIFICATION, etc.)' })
  getSettingsByCategory(@Param('category') category: string) {
    return this.settingsService.getSettingsByCategory(category);
  }

  @Patch(':key')
  @ApiOperation({ summary: 'Update system setting with audit recording' })
  updateSetting(@Param('key') key: string, @Body('value') value: string) {
    return this.settingsService.updateSetting(key, value);
  }
}
