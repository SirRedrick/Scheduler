import { Task } from "@prisma/client";
import { TaskList } from "../features/Tasks";

export default async function Home() {
  return (
    <div className="container mx-auto h-full py-4">
      <TaskList title="Tasks" />
    </div>
  );
}
