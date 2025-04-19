export interface IPrismaService {
  findUnique<T>(model: string, where: any): Promise<T | null>
  findFirst<T>(model: string, where: any): Promise<T | null>
  findMany<T>(model: string, where?: any): Promise<T[]>
  create<T>(model: string, data: any): Promise<T>
  update<T>(model: string, where: any, data: any): Promise<T>
  deleteMany(model: string, where: any): Promise<void>
  deleteFirst(model: string, where: any): Promise<void>
}
