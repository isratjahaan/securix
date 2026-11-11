import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ModulesService } from './modules.service';

@ApiTags('12-in-1 Ecosystem Module Center')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @ApiOperation({ summary: 'List all 12 cybersecurity ecosystem modules with live status & health' })
  getAllModules() {
    return this.modulesService.getAllModules();
  }

  @Get('dependencies')
  @ApiOperation({ summary: 'Retrieve full module dependency graph nodes and directed links' })
  getDependencyGraph() {
    return this.modulesService.getDependencyGraph();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single module details, permissions and health metrics' })
  getModuleById(@Param('id') id: string) {
    return this.modulesService.getModuleById(id);
  }

  @Get(':id/disable-impact')
  @ApiOperation({ summary: 'Evaluate dependency impact before disabling a module' })
  checkDisableImpact(@Param('id') id: string) {
    return this.modulesService.checkDisableImpact(id);
  }

  @Post(':id/enable')
  @ApiOperation({ summary: 'Activate module after verifying dependencies' })
  enableModule(@Param('id') id: string) {
    return this.modulesService.enableModule(id);
  }

  @Post(':id/disable')
  @ApiOperation({ summary: 'Safely disable module with dependency guard' })
  disableModule(@Param('id') id: string, @Body('force') force?: boolean) {
    return this.modulesService.disableModule(id, force);
  }

  @Post(':id/restart')
  @ApiOperation({ summary: 'Restart module services without data interruption' })
  restartModule(@Param('id') id: string) {
    return this.modulesService.restartModule(id);
  }

  @Post(':id/maintenance')
  @ApiOperation({ summary: 'Toggle maintenance mode for module' })
  setMaintenanceMode(@Param('id') id: string, @Body('enabled') enabled: boolean) {
    return this.modulesService.setMaintenanceMode(id, enabled);
  }

  @Patch(':id/configuration')
  @ApiOperation({ summary: 'Update module operational settings' })
  updateConfiguration(@Param('id') id: string, @Body() config: Record<string, any>) {
    return this.modulesService.updateConfiguration(id, config);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register approved enterprise module package' })
  registerModule(@Body() manifest: any) {
    return this.modulesService.registerModule(manifest);
  }
}
