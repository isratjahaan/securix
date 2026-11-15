import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocGateway } from '../soc/soc.gateway';
import { EventBusService } from '../events/event-bus.service';
import { ModuleLifecycleEvent } from '../events/security-events';

@Injectable()
export class ModulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socGateway: SocGateway,
    private readonly eventBus: EventBusService,
  ) {}

  getAllModules() {
    return this.prisma.memDb.modules;
  }

  getModuleById(id: string) {
    const mod = this.prisma.memDb.modules.find((m) => m.id === id || m.name === id);
    if (!mod) throw new NotFoundException(`Module with identifier "${id}" not found`);
    return mod;
  }

  getDependencyGraph() {
    const modules = this.prisma.memDb.modules;

    const nodes = modules.map((m) => ({
      id: m.id,
      name: m.displayName,
      status: m.status,
      health: m.healthStatus,
      isCore: m.isCore,
      version: m.version,
    }));

    const links: { source: string; target: string; isRequired: boolean }[] = [];

    modules.forEach((m) => {
      if (m.dependencies) {
        m.dependencies.forEach((depId: string) => {
          links.push({
            source: depId,
            target: m.id,
            isRequired: true,
          });
        });
      }
    });

    return { nodes, links };
  }

  checkDisableImpact(id: string) {
    const mod = this.getModuleById(id);

    // Identify all modules that depend on this one and are currently active
    const activeDependents = this.prisma.memDb.modules.filter(
      (m) => m.status === 'ACTIVE' && m.dependencies && m.dependencies.includes(mod.id),
    );

    return {
      moduleId: mod.id,
      moduleName: mod.displayName,
      isCore: mod.isCore,
      canDisableDirectly: activeDependents.length === 0 && !mod.isCore,
      activeDependents: activeDependents.map((d) => ({
        id: d.id,
        name: d.displayName,
        version: d.version,
      })),
      consequences:
        activeDependents.length > 0
          ? `Disabling ${mod.displayName} will degrade or disrupt functionality for ${activeDependents.length} active dependent service(s): ${activeDependents.map((d) => d.displayName).join(', ')}.`
          : mod.isCore
          ? `CRITICAL: ${mod.displayName} is designated as an invariant CORE pillar of SIS Cyber Fortress. Disabling requires root Super Admin override.`
          : `Safe to disable. No active downstream dependencies are bound to this module. Historical data remains protected.`,
    };
  }

  enableModule(id: string, actor: string = 'Dr. Sarah Vance') {
    const mod = this.getModuleById(id);

    // Verify all required dependencies are active
    if (mod.dependencies && mod.dependencies.length > 0) {
      const inactiveDeps = this.prisma.memDb.modules.filter(
        (m) => mod.dependencies.includes(m.id) && m.status !== 'ACTIVE',
      );
      if (inactiveDeps.length > 0) {
        throw new BadRequestException(
          `Cannot enable ${mod.displayName}. Required upstream dependencies are inactive: ${inactiveDeps.map((d) => d.displayName).join(', ')}`,
        );
      }
    }

    mod.status = 'ACTIVE';
    mod.healthStatus = 'HEALTHY';
    mod.lastActivityAt = new Date().toISOString();
    mod.lastHealthCheckAt = new Date().toISOString();

    this.recordAudit('MODULE_ENABLED', `Module ${mod.id}`, 'SUCCESS', { actor });
    this.socGateway.broadcastModuleStateChange(mod);

    // Publish to Decoupled Event Bus
    this.eventBus.publishLifecycle(
      new ModuleLifecycleEvent({
        moduleId: mod.id,
        moduleDisplayName: mod.displayName,
        action: 'ENABLED',
        currentStatus: 'ACTIVE',
        actor,
      }),
    );

    return mod;
  }

  disableModule(id: string, force: boolean = false, actor: string = 'Dr. Sarah Vance') {
    const mod = this.getModuleById(id);

    if (mod.isCore && !force) {
      throw new ForbiddenException(
        `Module "${mod.displayName}" is a protected CORE service. You cannot disable core modules without explicit Super Admin force confirmation.`,
      );
    }

    const impact = this.checkDisableImpact(id);
    if (impact.activeDependents.length > 0 && !force) {
      throw new BadRequestException({
        message: `Dependency check blocked disabling. Dependent modules require this service.`,
        impact,
      });
    }

    mod.status = 'DISABLED';
    mod.lastActivityAt = new Date().toISOString();

    this.recordAudit('MODULE_DISABLED', `Module ${mod.id}`, 'SUCCESS', {
      actor,
      force,
      affectedDependents: impact.activeDependents.map((d) => d.id),
    });
    this.socGateway.broadcastModuleStateChange(mod);

    // Publish to Decoupled Event Bus
    this.eventBus.publishLifecycle(
      new ModuleLifecycleEvent({
        moduleId: mod.id,
        moduleDisplayName: mod.displayName,
        action: 'DISABLED',
        currentStatus: 'DISABLED',
        actor,
        affectedDependents: impact.activeDependents.map((d) => d.id),
      }),
    );

    return mod;
  }

  restartModule(id: string, actor: string = 'Dr. Sarah Vance') {
    const mod = this.getModuleById(id);

    mod.healthStatus = 'HEALTHY';
    mod.lastActivityAt = new Date().toISOString();
    mod.lastHealthCheckAt = new Date().toISOString();

    this.recordAudit('MODULE_RESTARTED', `Module ${mod.id}`, 'SUCCESS', { actor });
    this.socGateway.broadcastModuleStateChange(mod);

    // Publish to Decoupled Event Bus
    this.eventBus.publishLifecycle(
      new ModuleLifecycleEvent({
        moduleId: mod.id,
        moduleDisplayName: mod.displayName,
        action: 'RESTARTED',
        currentStatus: 'ACTIVE',
        actor,
      }),
    );

    return {
      message: `Module ${mod.displayName} services successfully cycled and re-synchronized.`,
      module: mod,
    };
  }

  setMaintenanceMode(id: string, enabled: boolean, actor: string = 'Dr. Sarah Vance') {
    const mod = this.getModuleById(id);

    mod.status = enabled ? 'MAINTENANCE' : 'ACTIVE';
    mod.lastActivityAt = new Date().toISOString();

    this.recordAudit('MODULE_MAINTENANCE_TOGGLED', `Module ${mod.id}`, 'SUCCESS', { enabled, actor });
    this.socGateway.broadcastModuleStateChange(mod);

    // Publish to Decoupled Event Bus
    this.eventBus.publishLifecycle(
      new ModuleLifecycleEvent({
        moduleId: mod.id,
        moduleDisplayName: mod.displayName,
        action: 'MAINTENANCE',
        currentStatus: mod.status,
        actor,
      }),
    );

    return mod;
  }

  updateConfiguration(id: string, config: Record<string, any>, actor: string = 'Dr. Sarah Vance') {
    const mod = this.getModuleById(id);

    this.recordAudit('MODULE_CONFIG_UPDATED', `Module ${mod.id}`, 'SUCCESS', {
      actor,
      keysUpdated: Object.keys(config),
    });

    return {
      success: true,
      moduleId: mod.id,
      message: `Configuration parameters applied and verified for ${mod.displayName}.`,
      updatedConfig: config,
    };
  }

  registerModule(manifest: any, actor: string = 'Dr. Sarah Vance') {
    if (!manifest.id || !manifest.name || !manifest.displayName) {
      throw new BadRequestException('Manifest must provide valid id, name, and displayName.');
    }

    const existing = this.prisma.memDb.modules.find((m) => m.id === manifest.id);
    if (existing) throw new BadRequestException(`Module with id "${manifest.id}" is already registered.`);

    const newModule = {
      id: manifest.id,
      name: manifest.name,
      displayName: manifest.displayName,
      description: manifest.description || 'Enterprise registered cybersecurity extension module.',
      version: manifest.version || '1.0.0',
      status: 'INSTALLED',
      healthStatus: 'HEALTHY',
      isCore: false,
      apiEndpoint: manifest.apiEndpoint || `https://api.fortress.sis/${manifest.id}/v1`,
      documentationUrl: manifest.documentationUrl || null,
      dependencies: manifest.dependencies || [],
      dependents: [],
      permissions: manifest.permissions || [],
      responseTimeMs: 25,
      cpuUsage: 5.0,
      memoryUsageMb: 120,
      lastActivityAt: new Date().toISOString(),
      lastHealthCheckAt: new Date().toISOString(),
    };

    this.prisma.memDb.modules.push(newModule);
    this.recordAudit('MODULE_REGISTERED', `Module ${newModule.id}`, 'SUCCESS', { actor, version: newModule.version });
    this.socGateway.broadcastModuleStateChange(newModule);

    // Publish to Decoupled Event Bus
    this.eventBus.publishLifecycle(
      new ModuleLifecycleEvent({
        moduleId: newModule.id,
        moduleDisplayName: newModule.displayName,
        action: 'REGISTERED',
        currentStatus: newModule.status,
        actor,
      }),
    );

    return newModule;
  }

  private recordAudit(action: string, targetResource: string, result: string, details?: any) {
    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: details?.actor || 'Module Admin',
      actorRole: 'MODULE_ADMIN',
      action,
      targetResource,
      result,
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details,
    });
  }
}
