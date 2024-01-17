import { Role } from "src/auth/entities/role.schema"
import { RoleType } from "../enums"

export interface JwtPayload {
    sub: string
    role: RoleType[]
    role_id: Role
    refreshToken: string
}

export interface RequestWithUser extends Request {
    user: JwtPayload
}
