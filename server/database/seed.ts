import { PrismaClient, Task } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tasks = [
    {
      title: "Task 1",
    },
    {
      title: "Task 2",
    },
    {
      title: "Task 3",
    },
  ];

  await Promise.all(tasks.map((task) => prisma.task.create({ data: task })));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
