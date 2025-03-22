export interface IPrismaService {
  findOne<T>(model: string, where: any): Promise<T | null>
  findMany<T>(model: string, where?: any): Promise<T[]>
  create<T>(model: string, data: any): Promise<T>
  update<T>(model: string, where: any, data: any): Promise<T>
  delete(model: string, where: any): Promise<void>
}
