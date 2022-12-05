import { prisma } from "./database/client";

export const getAll = () => prisma.task.findMany();
