import { PrismaClient } from '@prisma/client'
import { injectable } from 'inversify'
import { IPrismaService } from '~/interfaces/IPrismaService'

@injectable()
export class PrismaService implements IPrismaService {
  private prisma: PrismaClient
  constructor() {
    this.prisma = new PrismaClient()
  }
  public async findOne<T>(model: string, where: any): Promise<T | null> {
    this.checkModelExist(model)
    return (await (this.prisma as any)[model].findUnique({
      where
    })) as Promise<T | null>
  }
  public async findMany<T>(model: string, where?: any): Promise<T[]> {
    this.checkModelExist(model)
    return (await (this.prisma as any)[model].findMany({
      where
    })) as Promise<T[]>
  }
  public async create<T>(model: string, data: any): Promise<T> {
    this.checkModelExist(model)
    return (await (this.prisma as any)[model].create({
      data
    })) as T
  }
  public async update<T>(model: string, where: any, data: any): Promise<T> {
    this.checkModelExist(model)
    return (await (this.prisma as any)[model].update({
      where,
      data
    })) as Promise<T>
  }
  public async delete(model: string, where: any): Promise<void> {
    this.checkModelExist(model)
    return await (this.prisma as any)[model].update({
      where
    })
  }

  private checkModelExist(model: string): void {
    if (!(this.prisma as any)[model]) {
      throw new Error(`Model ${model} không tồn tại trong Prisma`)
    }
  }
}
