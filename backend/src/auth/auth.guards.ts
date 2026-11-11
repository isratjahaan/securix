import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PERMISSIONS_KEY } from './auth.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Super Admin has universal access
    if (user.role === 'SUPER_ADMIN') return true;

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(`Operation requires one of [${requiredRoles.join(', ')}] role privileges.`);
    }

    return true;
  }
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    // Super admin wildcard
    if (user.role === 'SUPER_ADMIN' || (user.permissions && user.permissions.includes('*'))) {
      return true;
    }

    const userPerms: string[] = user.permissions || [];
    const hasAll = requiredPermissions.every((req) =>
      userPerms.some((up) => up === req || (up.endsWith('.*') && req.startsWith(up.slice(0, -2)))),
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Action denied. Missing required permission: [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}
