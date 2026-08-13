import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../../lib/taskStorage";

export default async function handler(req, res) {
  try {
    // =========================
    // GET - Get all tasks
    // =========================

    if (req.method === "GET") {
      const tasks = await getTasks();

      return res.status(200).json({
        tasks,
      });
    }


    // =========================
    // POST - Add new task
    // =========================

    if (req.method === "POST") {
      const task = req.body;

      if (!task || !task.title) {
        return res.status(400).json({
          error: "Task title is required.",
        });
      }

      const newTask = {
        ...task,
        id: task.id || Date.now(),
      };

      await addTask(newTask);

      return res.status(201).json({
        task: newTask,
      });
    }


    // =========================
    // PUT - Update task
    // =========================

    if (req.method === "PUT") {
      const {
        id,
        ...updatedTask
      } = req.body;

      if (!id) {
        return res.status(400).json({
          error: "Task ID is required.",
        });
      }

      const task = await updateTask(
        id,
        updatedTask
      );

      if (!task) {
        return res.status(404).json({
          error: "Task not found.",
        });
      }

      return res.status(200).json({
        task,
      });
    }


    // =========================
    // DELETE - Delete task
    // =========================

    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          error: "Task ID is required.",
        });
      }

      await deleteTask(id);

      return res.status(200).json({
        message: "Task deleted successfully.",
      });
    }


    // =========================
    // Unsupported method
    // =========================

    res.setHeader(
      "Allow",
      ["GET", "POST", "PUT", "DELETE"]
    );

    return res.status(405).json({
      error: `Method ${req.method} not allowed.`,
    });

  } catch (error) {
    console.error(
      "Tasks API error:",
      error
    );

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
}