import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../enums';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
