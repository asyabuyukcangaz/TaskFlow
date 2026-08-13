import { useEffect, useState } from "react";

import TaskList from "../src/components/tasks/TaskList";
import TaskDrawer from "../src/components/tasks/TaskDrawer";
import AddTask from "../src/components/tasks/AddTask";
import DashboardCharts from "../src/components/dashboard/DashboardCharts"; // YENİ

import {
  calculateProgress,
  getTodayDate,
} from "../src/utils/taskUtils";

import {
  loadTasks,
  saveTasks,
} from "../lib/taskStorage";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialTasks() {
      try {
        const data = await loadTasks();
        setTasks(data || []);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialTasks();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  const selectedTask = tasks.find(
    (task) => task.id === selectedTaskId
  );

  const sortedTasks = [...tasks];

  function addTask(taskData) {
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
    
    const newTask = {
      id: maxId + 1,
      title: taskData.title,
      description: taskData.description || "",
      responsiblePerson: taskData.responsiblePerson || "",
      assignedTo: taskData.assignedTo || "",
      startDate: taskData.startDate || getTodayDate(),
      dueDate: taskData.dueDate,
      finishDate: null,
      priority: taskData.priority || "Medium",
      notes: "",
      miniTasks: taskData.miniTasks || [],
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setShowAddTask(false);
  }

  function deleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
    setSelectedTaskId(null);
  }

  function updateTask(taskId, changes) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, ...changes } : task
      )
    );
  }

  function toggleMiniTask(taskId, miniTaskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const updatedMiniTasks = task.miniTasks.map((miniTask) =>
          miniTask.id === miniTaskId
            ? { ...miniTask, completed: !miniTask.completed }
            : miniTask
        );

        const progress = calculateProgress(updatedMiniTasks);
        let finishDate = task.finishDate;

        if (progress === 100 && !finishDate) {
          finishDate = getTodayDate();
        }

        if (progress < 100) {
          finishDate = null;
        }

        return {
          ...task,
          miniTasks: updatedMiniTasks,
          finishDate,
        };
      })
    );
  }

  function addMiniTask(taskId, title) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const newMiniTask = {
          id: Date.now() + Math.random() * 1000,
          title: title.trim(),
          completed: false,
        };

        return {
          ...task,
          miniTasks: [...task.miniTasks, newMiniTask],
          finishDate: null,
        };
      })
    );
  }

  function updateNotes(taskId, notes) {
    updateTask(taskId, { notes });
  }

  function updatePriority(taskId, priority) {
    updateTask(taskId, { priority });
  }

  function updateTitle(taskId, title) {
    updateTask(taskId, { title });
  }

  function updateDescription(taskId, description) {
    updateTask(taskId, { description });
  }

  function updateResponsiblePerson(taskId, responsiblePerson) {
    updateTask(taskId, { responsiblePerson });
  }

  function updateAssignedTo(taskId, assignedTo) {
    updateTask(taskId, { assignedTo });
  }

  function updateStartDate(taskId, startDate) {
    updateTask(taskId, { startDate });
  }

  function updateDueDate(taskId, dueDate) {
    updateTask(taskId, { dueDate });
  }

  if (loading) {
    return (
      <div className="task-loading">
        Loading tasks...
      </div>
    );
  }

  return (
    <main className="task-page">
      <div className="task-layout">
        {/* LEFT - TASK LIST (2/3) */}
        <section className="tasks-main">
          <header className="tasks-header">
            <div>
              <h1 className="tasks-title">TaskFlow</h1>
              <p className="tasks-subtitle">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in your workspace
              </p>
            </div>
            <button
              className="add-task-button"
              onClick={() => setShowAddTask(true)}
            >
              + Add Task
            </button>
          </header>

          <TaskList
            tasks={sortedTasks}
            onTaskClick={(task) => setSelectedTaskId(task.id)}
          />
        </section>

        {/* RIGHT - DASHBOARD (1/3) */}
        <aside className="dashboard-panel">
          <div className="dashboard-content">
            <h2 className="dashboard-title">Dashboard</h2>
            
            {/* DASHBOARD CHARTS - YENİ */}
            <DashboardCharts tasks={tasks} />
          </div>
        </aside>
      </div>

      {/* ADD TASK MODAL */}
      {showAddTask && (
        <AddTask
          onClose={() => setShowAddTask(false)}
          onCreate={addTask}
        />
      )}

      {/* TASK DRAWER */}
      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onDelete={() => deleteTask(selectedTask.id)}
          onTitleChange={(value) => updateTitle(selectedTask.id, value)}
          onDescriptionChange={(value) => updateDescription(selectedTask.id, value)}
          onResponsiblePersonChange={(value) =>
            updateResponsiblePerson(selectedTask.id, value)
          }
          onAssignedToChange={(value) =>
            updateAssignedTo(selectedTask.id, value)
          }
          onStartDateChange={(value) =>
            updateStartDate(selectedTask.id, value)
          }
          onDueDateChange={(value) =>
            updateDueDate(selectedTask.id, value)
          }
          onPriorityChange={(value) =>
            updatePriority(selectedTask.id, value)
          }
          onNotesChange={(value) =>
            updateNotes(selectedTask.id, value)
          }
          onToggleMiniTask={(miniTaskId) =>
            toggleMiniTask(selectedTask.id, miniTaskId)
          }
          onAddMiniTask={(title) =>
            addMiniTask(selectedTask.id, title)
          }
        />
      )}
    </main>
  );
}