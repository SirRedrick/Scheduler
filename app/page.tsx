import { CheckIcon } from "@heroicons/react/24/outline";
import { getAll } from "../server/task";

export default async function Home() {
  const tasks = await getAll();

  return (
    <div className="container mx-auto h-full">
      <h2 id="task-list-label" className="mt-2 mb-6 text-xl">
        Tasks
      </h2>
      <div role="group" aria-labelledby="task-list-label">
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-2">
              <div className="h-6 w-6 rounded border border-slate-7">
                <CheckIcon />
              </div>
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
