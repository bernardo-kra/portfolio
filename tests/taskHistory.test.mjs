import test from 'node:test'
import assert from 'node:assert/strict'
import {
  removeTask,
  restoreTask,
} from '../src/components/pomodoro/TaskList/taskHistory.ts'

const sample = () => [
  {
    id: 'a',
    name: 'Estudar',
    estimatedCycles: 3,
    completedCycles: 2,
    isCompleted: false,
  },
  {
    id: 'b',
    name: 'Revisar',
    estimatedCycles: 1,
    completedCycles: 1,
    isCompleted: true,
  },
  {
    id: 'c',
    name: 'Praticar',
    estimatedCycles: 2,
    completedCycles: 0,
    isCompleted: false,
  },
]

test('removes only the requested task without mutating input', () => {
  const tasks = Object.freeze(sample().map((task) => Object.freeze(task)))
  const result = removeTask(tasks, 'b')
  assert.deepEqual(
    result.tasks.map((task) => task.id),
    ['a', 'c']
  )
  assert.equal(result.deleted.index, 1)
  assert.equal(tasks.length, 3)
})

test('undo restores position, progress and completion', () => {
  const tasks = sample()
  const result = removeTask(tasks, 'b')
  assert.deepEqual(restoreTask(result.tasks, result.deleted), tasks)
})

test('multiple deletions can be undone in reverse order', () => {
  const tasks = sample()
  const first = removeTask(tasks, 'a')
  const second = removeTask(first.tasks, 'c')
  const restored = restoreTask(
    restoreTask(second.tasks, second.deleted),
    first.deleted
  )
  assert.deepEqual(restored, tasks)
})

test('missing task leaves state unchanged', () => {
  const tasks = sample()
  const result = removeTask(tasks, 'missing')
  assert.equal(result.tasks, tasks)
  assert.equal(result.deleted, null)
})

test('undo does not duplicate an existing task', () => {
  const tasks = sample()
  assert.equal(restoreTask(tasks, { task: tasks[0], index: 0 }), tasks)
})

test('undo remains valid after the remaining list becomes empty', () => {
  const tasks = sample()
  const result = removeTask(tasks, 'c')
  assert.deepEqual(restoreTask([], result.deleted), [tasks[2]])
})
