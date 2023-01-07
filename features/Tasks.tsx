"use client";

import * as React from "react";
import { Task as TaskType } from "@prisma/client";
import {
  useFloating,
  autoUpdate,
  shift,
  FloatingPortal,
} from "@floating-ui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

const tasks: TaskType[] = [
  {
    id: "1",
    title: "Task 1",
    isDone: false,
  },
  {
    id: "2",
    title: "Task 2",
    isDone: false,
  },
  {
    id: "3",
    title: "Task 3",
    isDone: false,
  },
  {
    id: "4",
    title: "Task 4",
    isDone: false,
  },
  {
    id: "5",
    title: "Task 5",
    isDone: false,
  },
];

type TaskListProps = {
  title: string;
};

export function TaskList({ title }: TaskListProps) {
  const [dragged, setDragged] = React.useState<TaskType[]>([]);

  const hasDraggedTasks = !!dragged.length;
  const addDragged = (task: TaskType) => setDragged((prev) => [...prev, task]);
  const clearDragged = () => setDragged([]);

  React.useEffect(() => {
    function onPointerUp() {
      if (hasDraggedTasks) {
        setDragged([]);
      }
    }
    document.addEventListener("pointerup", onPointerUp);
    () => document.removeEventListener("pointerup", onPointerUp);
  }, [hasDraggedTasks]);

  const { x, y, reference, floating, strategy } = useFloating({
    open: hasDraggedTasks,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [
      {
        name: "center",
        fn: ({ x, y, elements }) => ({
          x: x - elements.floating.clientWidth / 2,
          y: y - elements.floating.clientHeight / 2,
        }),
      },
      shift({ padding: 5 }),
    ],
  });

  React.useEffect(() => {
    function onPointerMove({ clientX: x, clientY: y }: PointerEvent) {
      reference({
        getBoundingClientRect() {
          return {
            x,
            y,
            width: 0,
            height: 0,
            top: y,
            right: x,
            bottom: y,
            left: x,
          };
        },
      });
    }
    document.addEventListener("pointermove", onPointerMove);
    () => document.removeEventListener("pointermove", onPointerMove);
  }, [reference]);

  return (
    <div className="rounded bg-slate-2 p-2 dark:bg-slate-dark-2">
      <h2 id="task-list-label" className="mb-3 text-xl">
        {title}
      </h2>
      <ul role="group" aria-labelledby="task-list-label" className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onDrag={addDragged} />
        ))}
      </ul>
      <FloatingPortal>
        {hasDraggedTasks && (
          <div
            ref={floating}
            style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
          >
            {dragged.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </FloatingPortal>
    </div>
  );
}

type Props = {
  task: TaskType;
  isDragged?: boolean;
  onDrag?: (task: TaskType) => void;
};

export function TaskItem({ task, isDragged = false, onDrag }: Props) {
  return (
    <li
      key={task.id}
      className="flex cursor-grab items-center gap-2 rounded bg-slate-3 p-1 dark:bg-slate-dark-3"
      onPointerDown={() => !isDragged && onDrag?.(task)}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="h-6 w-6 rounded border border-slate-7 dark:border-slate-dark-7">
        <CheckIcon />
      </div>
      {task.title}
    </li>
  );
}
