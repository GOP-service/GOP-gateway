import { FilterQuery, Model, QueryOptions } from "mongoose";
import { BaseServiceInterface as BaseServiceInterface, FindAllResponse } from "../interfaces";
import { BaseEntity } from "./base.entity";

export abstract class BaseServiceAbstract<T extends BaseEntity>implements BaseServiceInterface<T>{
    protected constructor(protected readonly model: Model<T>) {
        this.model = model;
    }

    async create(dto: T | any): Promise<T> {
        const created_data = new this.model(dto);
        return created_data.save();
    }

    async findOneById(id: string): Promise<T> {
        const item = await this.model.findById(id);
        return item.deleted_at ? null : item;
    }

    async findOneByCondition(condition = {}): Promise<T> {
        return await this.model
            .findOne({
                ...condition,
                deleted_at: null,
            })
            .exec();
    }

    async findAll(
        condition: FilterQuery<T>,
        options?: QueryOptions<T>,
    ): Promise<FindAllResponse<T>> {
        const [count, items] = await Promise.all([
            this.model.countDocuments({ ...condition, deleted_at: null }),
            this.model.find({ ...condition, deleted_at: null }, options?.projection, options),
        ]);
        return {
            count,
            items,
        };
    }

    async update(id: string, dto: Partial<T>): Promise<T> {
        return await this.model.findOneAndUpdate(
            { _id: id, deleted_at: null },
            dto,
            { new: true },
        );
    }

    async softDelete(id: string): Promise<boolean> {
        const delete_item = await this.model.findById(id);
        if (!delete_item) {
            return false;
        }

        return !!(await this.model
            .findByIdAndUpdate<T>(id, { deleted_at: new Date() })
            .exec());
    }

    async permanentlyDelete(id: string): Promise<boolean> {
        const delete_item = await this.model.findById(id);
        if (!delete_item) {
            return false;
        }
        return !!(await this.model.findByIdAndDelete(id));
    }
}