export interface DeletedTask<T> {
  task: T
  index: number
}

export function removeTask<T extends { id: string }>(tasks: T[], id: string) {
  const index = tasks.findIndex((task) => task.id === id)
  if (index < 0) return { tasks, deleted: null }
  return {
    tasks: tasks.filter((task) => task.id !== id),
    deleted: { task: tasks[index], index },
  }
}

export function restoreTask<T extends { id: string }>(
  tasks: T[],
  deleted: DeletedTask<T>
): T[] {
  if (tasks.some((task) => task.id === deleted.task.id)) return tasks
  const restored = [...tasks]
  restored.splice(
    Math.min(Math.max(0, deleted.index), restored.length),
    0,
    deleted.task
  )
  return restored
}
