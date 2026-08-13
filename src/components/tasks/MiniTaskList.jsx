import MiniTaskItem from "./MiniTaskItem";

export default function MiniTaskList({
  miniTasks,
  onToggle,
}) {
  if (!miniTasks || miniTasks.length === 0) {
    return (
      <div className="empty-mini-tasks">
        No mini tasks yet.
      </div>
    );
  }

  return (
    <div className="mini-task-list">
      {miniTasks.map((miniTask) => (
        <button
          key={miniTask.id}
          type="button"
          className={`mini-task-item ${
            miniTask.completed ? "completed" : ""
          }`}
          onClick={() => onToggle(miniTask.id)}
        >
          <span
            className={`mini-task-checkbox ${
              miniTask.completed ? "checked" : ""
            }`}
          >
            {miniTask.completed ? "✓" : ""}
          </span>
          <span className="mini-task-title">
            {miniTask.title}
          </span>
        </button>
      ))}
    </div>
  );
}