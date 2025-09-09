import React, { useState, useEffect } from 'react'
import { Typography, Button, Input, Card, Tag } from '@components/common'
import { Plus, Check, Trash2, Target, Play } from 'lucide-react'
import { usePomodoro } from '@src/context/PomodoroContext'
import styles from './styles.module.css'

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
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskCycles, setNewTaskCycles] = useState(1)
  const [isAddingTask, setIsAddingTask] = useState(false)

  useEffect(() => {
    const savedTasks = localStorage.getItem('pomodoro-tasks')
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }))
        setTasks(tasksWithDates)
      } catch (error) {
        console.error('Error loading tasks:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (state.cycles.length > 0) {
      const lastCycle = state.cycles[0]
      if (lastCycle.mode === 'focus' && lastCycle.completedAt) {
        const lastProcessedCycle = localStorage.getItem('last-processed-cycle')
        if (lastProcessedCycle !== lastCycle.id) {
          localStorage.setItem('last-processed-cycle', lastCycle.id)
          
          setTasks(prevTasks => {
            const updatedTasks = [...prevTasks]
            const incompleteTaskIndex = updatedTasks.findIndex(task => !task.isCompleted)
            
            if (incompleteTaskIndex !== -1) {
              updatedTasks[incompleteTaskIndex].completedCycles += 1
              
              if (updatedTasks[incompleteTaskIndex].completedCycles >= updatedTasks[incompleteTaskIndex].estimatedCycles) {
                updatedTasks[incompleteTaskIndex].isCompleted = true
              }
            }
            
            return updatedTasks
          })
        }
      }
    }
  }, [state.cycles])

  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        estimatedCycles: newTaskCycles,
        completedCycles: 0,
        isCompleted: false,
        createdAt: new Date()
      }
      
      setTasks(prev => [newTask, ...prev])
      setNewTaskName('')
      setNewTaskCycles(1)
      setIsAddingTask(false)
    }
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    ))
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    if (state.activeTaskId === taskId) {
      setActiveTask(null)
    }
  }

  const startTask = (task: Task) => {
    setActiveTask({ taskId: task.id, taskName: task.name })
  }

  const getProgressPercentage = (task: Task) => {
    return Math.min((task.completedCycles / task.estimatedCycles) * 100, 100)
  }

  const getProgressColor = (task: Task) => {
    const percentage = getProgressPercentage(task)
    if (percentage >= 100) return 'success'
    if (percentage >= 50) return 'brand'
    return 'muted'
  }

  return (
    <div className={styles.taskList}>
      <div className={styles.taskHeader}>
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

      {isAddingTask && (
        <Card variant="outlined" className={styles.addTaskCard}>
          <div className={styles.addTaskForm}>
            <Input
              label="Nome da Tarefa"
              value={newTaskName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskName(e.target.value)}
              placeholder="Digite o nome da tarefa..."
              className={styles.taskInput}
            />
            <Input
              label="Ciclos Estimados"
              type="number"
              min="1"
              max="20"
              value={newTaskCycles}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskCycles(Number(e.target.value))}
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
                disabled={!newTaskName.trim()}
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
              Crie tarefas para acompanhar seu progresso durante os ciclos de foco
            </Typography>
          </div>
        ) : (
          tasks.map(task => (
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
                       icon={task.isCompleted ? <Check size={16} /> : undefined}
                     >
                       {!task.isCompleted && <div className={styles.checkbox} />}
                     </Button>
                     
                     <Typography 
                       variant="h6" 
                       className={styles.taskName}
                       style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}
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
                           Iniciar
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
                          backgroundColor: `var(--${getProgressColor(task)})`
                        }}
                      />
                    </div>
                    <div className={styles.progressText}>
                      <Tag variant={getProgressColor(task) as any} size="sm">
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
