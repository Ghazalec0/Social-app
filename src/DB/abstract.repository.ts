import {
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";


export abstract class AbstractRepository<T> {
  constructor(private _model: Model<T>) {}

 get model(): Model<T> {
    return this._model;
  }
  public async create(item: Partial<T>) {
    const doc = new this._model(item); // ram
    return doc.save();
  }

  public async getOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ) {
    return this._model.findOne(filter, projection, options); // sort , skip , limit, populate
  }

  public async getAll(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ) {
    return this._model.find(filter, projection, options); // sort , skip , limit, populate
  }

  public async updateOne(
  filter: QueryFilter<T>,
  update: UpdateQuery<T>,
  options: QueryOptions = {},
) {
  options.returnDocument = "after";
  return this._model.findOneAndUpdate(filter, update, options);
}

  public async deleteOne(filter: QueryFilter<T>) {
   return this._model.deleteOne(filter);
    }
}