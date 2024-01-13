import { RoleType } from "../enums"

export interface JwtPayload {
    sub: string
    role: RoleType[]
    refreshToken: string
}

export interface RequestWithUser extends Request {
    user: JwtPayload
}
