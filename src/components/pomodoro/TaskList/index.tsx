import React, { useState, useEffect, useRef } from 'react'
import { Typography, Button, Input, Card, Tag } from '@components/common'
import { Plus, Check, Trash2, Target, Play } from 'lucide-react'
import { usePomodoro } from '@src/context/PomodoroContext'
import styles from './styles.module.css'
import { removeTask, restoreTask, type DeletedTask } from './taskHistory'

interface Task {
  id: string
  name: string
  estimatedCycles: number
  completedCycles: number
  isCompleted: boolean
  createdAt: Date
}

const TaskList: React.FC = () => {
  const { state, setActiveTask } = usePomodoro()
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('pomodoro-tasks')
      if (!savedTasks) return []
      const parsedTasks = JSON.parse(savedTasks) as Array<
        Omit<Task, 'createdAt'> & { createdAt: string }
      >
      return parsedTasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }))
    } catch {
      return []
    }
  })
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskCycles, setNewTaskCycles] = useState(1)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [deletedTasks, setDeletedTasks] = useState<
    (DeletedTask<Task> & { wasActive: boolean })[]
  >([])
  const [taskNotice, setTaskNotice] = useState('')
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks))
    } catch {
      console.error('Unable to save tasks on this device')
    }
  }, [tasks])

  useEffect(() => {
    if (state.cycles.length > 0) {
      const lastCycle = state.cycles[0]
      if (lastCycle.mode === 'focus' && lastCycle.completedAt) {
        const lastProcessedCycle = localStorage.getItem('last-processed-cycle')
        if (lastProcessedCycle !== lastCycle.id) {
          localStorage.setItem('last-processed-cycle', lastCycle.id)

          setTasks((prevTasks) =>
            prevTasks.map((task) => {
              if (task.id !== lastCycle.taskId || task.isCompleted) return task
              const completedCycles = task.completedCycles + 1
              return {
                ...task,
                completedCycles,
                isCompleted: completedCycles >= task.estimatedCycles,
              }
            })
          )
        }
      }
    }
  }, [state.cycles])

  const addTask = () => {
    if (
      newTaskName.trim() &&
      Number.isInteger(newTaskCycles) &&
      newTaskCycles >= 1 &&
      newTaskCycles <= 20
    ) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        estimatedCycles: newTaskCycles,
        completedCycles: 0,
        isCompleted: false,
        createdAt: new Date(),
      }

      setTasks((prev) => [newTask, ...prev])
      setNewTaskName('')
      setNewTaskCycles(1)
      setIsAddingTask(false)
    }
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    )
  }

  const deleteTask = (taskId: string) => {
    const result = removeTask(tasks, taskId)
    const deleted = result.deleted
    if (!deleted) return
    setTasks(result.tasks)
    setDeletedTasks((prev) => [
      ...prev,
      { ...deleted, wasActive: state.activeTaskId === taskId },
    ])
    setTaskNotice(
      `Tarefa “${deleted.task.name}” excluída. Você pode desfazer abaixo enquanto esta página estiver aberta.`
    )
    headerRef.current?.focus()
    if (state.activeTaskId === taskId) {
      setActiveTask(null)
    }
  }

  const undoDelete = () => {
    const deleted = deletedTasks.at(-1)
    if (!deleted) return
    setTasks((prev) => restoreTask(prev, deleted))
    setDeletedTasks((prev) => prev.slice(0, -1))
    if (deleted.wasActive && !state.activeTaskId) {
      setActiveTask({ taskId: deleted.task.id, taskName: deleted.task.name })
    }
    setTaskNotice(`Tarefa “${deleted.task.name}” restaurada com seu progresso.`)
    headerRef.current?.focus()
  }

  const startTask = (task: Task) => {
    setActiveTask({ taskId: task.id, taskName: task.name })
  }

  const getProgressPercentage = (task: Task) => {
    return Math.min((task.completedCycles / task.estimatedCycles) * 100, 100)
  }

  const getProgressColor = (task: Task): 'success' | 'brand' | 'default' => {
    const percentage = getProgressPercentage(task)
    if (percentage >= 100) return 'success'
    if (percentage >= 50) return 'brand'
    return 'default'
  }

  return (
    <div className={styles.taskList}>
      <div className={styles.taskHeader} ref={headerRef} tabIndex={-1}>
        <div className={styles.taskTitle}>
          <Target size={20} className={styles.taskIcon} />
          <Typography variant="h4" weight="semibold">
            Tarefas
          </Typography>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddingTask(!isAddingTask)}
          icon={<Plus size={16} />}
        >
          Nova Tarefa
        </Button>
      </div>

      <div className={styles.undoArea}>
        <p role="status" aria-atomic="true" className={styles.taskNotice}>
          {taskNotice}
        </p>
        {deletedTasks.length > 0 && (
          <button
            type="button"
            className={styles.undoButton}
            onClick={undoDelete}
          >
            Desfazer última exclusão
            {deletedTasks.length > 1
              ? ` (${deletedTasks.length} disponíveis)`
              : ''}
          </button>
        )}
      </div>

      {isAddingTask && (
        <Card variant="outlined" className={styles.addTaskCard}>
          <div className={styles.addTaskForm}>
            <Input
              label="Nome da Tarefa"
              value={newTaskName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewTaskName(e.target.value)
              }
              placeholder="Digite o nome da tarefa..."
              className={styles.taskInput}
            />
            <Input
              label="Ciclos Estimados"
              type="number"
              min="1"
              max="20"
              value={newTaskCycles}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewTaskCycles(Number(e.target.value))
              }
              className={styles.cyclesInput}
            />
            <div className={styles.addTaskActions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingTask(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={addTask}
                disabled={
                  !newTaskName.trim() ||
                  !Number.isInteger(newTaskCycles) ||
                  newTaskCycles < 1 ||
                  newTaskCycles > 20
                }
              >
                Adicionar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className={styles.tasksContainer}>
        {tasks.length === 0 ? (
          <div className={styles.emptyTasks}>
            <Target size={48} className={styles.emptyIcon} />
            <Typography variant="body1" color="muted">
              Nenhuma tarefa criada
            </Typography>
            <Typography variant="body2" color="muted">
              Crie tarefas para acompanhar seu progresso durante os ciclos de
              foco
            </Typography>
          </div>
        ) : (
          tasks.map((task) => (
            <Card
              key={task.id}
              variant="default"
              className={`${styles.taskCard} ${task.isCompleted ? styles.completedTask : ''}`}
            >
              <div className={styles.taskContent}>
                <div className={styles.taskInfo}>
                  <div className={styles.taskNameRow}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={styles.completeButton}
                      aria-label={`${task.isCompleted ? 'Reabrir' : 'Concluir'} tarefa: ${task.name}`}
                      aria-pressed={task.isCompleted}
                      icon={task.isCompleted ? <Check size={16} /> : undefined}
                    >
                      {!task.isCompleted && <div className={styles.checkbox} />}
                    </Button>

                    <Typography
                      variant="h6"
                      className={styles.taskName}
                      style={{
                        textDecoration: task.isCompleted
                          ? 'line-through'
                          : 'none',
                      }}
                    >
                      {task.name}
                    </Typography>

                    <div className={styles.taskButtons}>
                      {!task.isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startTask(task)}
                          className={styles.startButton}
                          icon={<Play size={16} />}
                        >
                          {state.activeTaskId === task.id
                            ? 'Selecionada'
                            : 'Selecionar'}
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className={styles.deleteButton}
                        icon={<Trash2 size={16} />}
                      >
                        Deletar
                      </Button>
                    </div>
                  </div>

                  <div className={styles.taskProgress}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${getProgressPercentage(task)}%`,
                          backgroundColor: `var(--${getProgressColor(task)})`,
                        }}
                      />
                    </div>
                    <div className={styles.progressText}>
                      <Tag variant={getProgressColor(task)} size="sm">
                        {task.completedCycles}/{task.estimatedCycles} ciclos
                      </Tag>
                      {task.isCompleted && (
                        <Tag variant="success" size="sm">
                          Concluída
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default TaskList
