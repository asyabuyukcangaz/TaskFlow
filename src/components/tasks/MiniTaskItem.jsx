export default function MiniTaskItem({
  miniTask,
  onToggle,
}) {
  if (!miniTask) {
    return null;
  }

  return (
    <label
      className={`mini-task-item ${
        miniTask.completed ? "completed" : ""
      }`}
    >
      <input
        className="mini-task-checkbox"
        type="checkbox"
        checked={miniTask.completed}
        onChange={() => onToggle(miniTask.id)}
      />
      <span className="mini-task-title">
        {miniTask.title}
      </span>
    </label>
  );
}