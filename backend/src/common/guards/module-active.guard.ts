import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { REQUIRE_ACTIVE_MODULE_KEY } from '../decorators/require-active-module.decorator';

@Injectable()
export class ModuleActiveGuard implements CanActivate {
  private readonly logger = new Logger('ModuleActiveGuard');

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredModuleId = this.reflector.getAllAndOverride<string>(
      REQUIRE_ACTIVE_MODULE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no module constraint is defined on handler or class, allow execution
    if (!requiredModuleId) {
      return true;
    }

    const moduleRecord = this.prisma.memDb.modules.find(
      (m: any) => m.id === requiredModuleId || m.name === requiredModuleId,
    );

    if (!moduleRecord) {
      this.logger.warn(`Access check failed: Module '${requiredModuleId}' not found in registry`);
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          error: 'Service Unavailable',
          message: `Cybersecurity module '${requiredModuleId}' is not registered in central registry.`,
          moduleId: requiredModuleId,
          moduleStatus: 'NOT_FOUND',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (moduleRecord.status === 'DISABLED') {
      this.logger.warn(
        `[ACCESS BLOCKED] Request denied to disabled module: ${moduleRecord.displayName} (${moduleRecord.id})`,
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          error: 'Service Unavailable',
          message: `Module '${moduleRecord.displayName}' is currently DISABLED by administrator security policy. Underlying data remains preserved.`,
          moduleId: moduleRecord.id,
          moduleStatus: 'DISABLED',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (moduleRecord.status === 'MAINTENANCE') {
      this.logger.warn(
        `[ACCESS BLOCKED] Request intercepted for maintenance: ${moduleRecord.displayName} (${moduleRecord.id})`,
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          error: 'Service Unavailable',
          message: `Module '${moduleRecord.displayName}' is temporarily offline for scheduled MAINTENANCE. Please retry shortly.`,
          moduleId: moduleRecord.id,
          moduleStatus: 'MAINTENANCE',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Module is ACTIVE or HEALTHY
    return true;
  }
}
