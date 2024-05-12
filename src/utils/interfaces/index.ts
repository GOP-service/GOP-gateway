import { RoleType } from "../enums";

export interface JwtPayload {
    sub: string
    role: RoleType
    refreshToken: string
}

export interface RequestWithUser extends Request {
    user: JwtPayload
}
export type FindAllResponse<T> = { count: number; items: T[] };

export interface BaseServiceInterface<T> {
    create(dto: T | any): Promise<T>;

    findOneById(id: string, projection?: string): Promise<T>;

    findOneByCondition(condition?: object, projection?: string): Promise<T>;

    findAll(
        condition: object,
        options?: object,
    ): Promise<FindAllResponse<T>>;

    update(id: string, dto: Partial<T>): Promise<T>;

    softDelete(id: string): Promise<boolean>;

    permanentlyDelete(id: string): Promise<boolean>;
}