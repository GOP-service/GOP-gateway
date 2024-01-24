import { CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../enums';
import { JwtPayload } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly _reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this._reflector.getAllAndOverride<RoleType[]>('roles', [context.getHandler(), context.getClass()]);

        if (!roles || roles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: JwtPayload = request.user;

        const hasRole = () => Object.keys(user.role_id)
            .filter((key) =>   roles[key] !== undefined 
                            && roles[key] !== null
                            && roles[key] !== false
                            && roles[key] !== ''
                    ).some((role) => roles.includes(role as RoleType));

        if (user && user.role_id && hasRole()) {
            return true;
        }

        throw new ForbiddenException('You don\'t have permission to access this resource');
    }
}
