import { PrismaClient } from "@prisma/client";

// Singleton so Next.js hot-reload in dev doesn't exhaust connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
