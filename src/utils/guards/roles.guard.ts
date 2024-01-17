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

        const hasRole = () => user.role.some((role) => roles.includes(role));


        if (user && user.role && hasRole()) {
            return true;
        }

        throw new ForbiddenException('You don\'t have permission to access this resource');
    }
}
