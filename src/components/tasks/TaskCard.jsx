import {
  calculateProgress,
  getDifferenceText,
  getProgressColor,
} from "../../utils/taskUtils";

export default function TaskCard({ task, onClick, index }) {
  // Güvenlik kontrolü - task undefined ise boş göster
  if (!task) {
    return null;
  }

  const progress = calculateProgress(task.miniTasks || []);
  const progressColor = getProgressColor(progress);

  // Difference hesaplama - Sadece sayısal değer
  const getDifferenceValue = () => {
    if (!task.finishDate || !task.dueDate) {
      return { text: '—', color: '#9ca3af' };
    }
    
    const due = new Date(`${task.dueDate}T00:00:00`);
    const finish = new Date(`${task.finishDate}T00:00:00`);
    const diff = Math.round((finish - due) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) {
      return { text: '0', color: '#22c55e' };
    } else if (diff < 0) {
      return { text: `${diff}`, color: '#22c55e' }; // Örn: -3
    } else {
      return { text: `+${diff}`, color: '#ef4444' }; // Örn: +3
    }
  };

  const diffValue = getDifferenceValue();

  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-main">
        {/* Index */}
        <div className="task-index-cell">{index || "—"}</div>

        {/* Task Title */}
        <div className="task-title-cell">
          <h3>{task.title || "Untitled Task"}</h3>
          <p>{task.description || "No description provided."}</p>
        </div>

        {/* Responsible Person */}
        <div className="task-person-cell">
          <span>{task.responsiblePerson || "—"}</span>
        </div>

        {/* Assigned To */}
        <div className="task-person-cell">
          <span>{task.assignedTo || "—"}</span>
        </div>

        {/* Start Date */}
        <div className="task-date-cell">
          <span>{task.startDate || "—"}</span>
        </div>

        {/* Due Date */}
        <div className="task-date-cell">
          <span>{task.dueDate || "—"}</span>
        </div>

        {/* Finish Date */}
        <div className="task-date-cell">
          <span>{task.finishDate || "—"}</span>
        </div>

        {/* DIFFERENCE - Sadece sayısal değer */}
        <div className="task-difference-cell">
          <span style={{ 
            color: diffValue.color,
            fontWeight: 700,
            fontSize: '14px'
          }}>
            {diffValue.text}
          </span>
        </div>

        {/* Progress (compact) */}
        <div className="task-progress-compact">
          <div className="progress-track-compact">
            <div
              className="progress-fill-compact"
              style={{
                width: `${progress}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
          <span className="progress-percent">{progress}%</span>
        </div>

        {/* Priority */}
        <div className="task-priority-cell">
          <span className={`priority-badge priority-${String(task.priority || "Low").toLowerCase()}`}>
            {task.priority || "Low"}
          </span>
        </div>
      </div>
    </div>
  );
}