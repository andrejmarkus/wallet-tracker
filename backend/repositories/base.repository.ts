export interface IBaseRepository<T, ID = string> {
  create(data: any): Promise<T>;
  update(id: ID, data: any): Promise<T>;
  delete(id: ID): Promise<T>;
  findById(id: ID): Promise<T | null>;
  findAll(filter?: any): Promise<T[]>;
}
