import { PrismaClient } from "@prisma/client"
import { PrismaMssql } from "@prisma/adapter-mssql"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaMssql(process.env.DATABASE_URL as string),
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
