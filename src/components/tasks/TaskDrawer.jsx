import {
  calculateProgress,
  getCompletedMiniTaskCount,
  getDifferenceText,
  getProgressColor,
} from "../../utils/taskUtils";

import MiniTaskList from "./MiniTaskList";
import AddMiniTask from "./AddMiniTask";

export default function TaskDrawer({
  task,
  onClose,
  onDelete,
  onTitleChange,
  onDescriptionChange,
  onResponsiblePersonChange,
  onAssignedToChange,
  onToggleMiniTask,
  onAddMiniTask,
  onPriorityChange,
  onStartDateChange,
  onDueDateChange,
  onNotesChange,
}) {
  if (!task) {
    return null;
  }

  const progress = calculateProgress(task.miniTasks);
  const completedCount = getCompletedMiniTaskCount(task.miniTasks);
  const difference = getDifferenceText(task.dueDate, task.finishDate);
  const progressColor = getProgressColor(progress);

  return (
    <>
      {/* OVERLAY */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* DRAWER */}
      <aside className="task-drawer">
        {/* HEADER */}
        <div className="drawer-header">
          <div style={{ flex: 1 }}>
            <span className="drawer-label">TASK DETAILS</span>
            <input
              className="task-edit-input"
              value={task.title || ""}
              onChange={(event) => onTitleChange(event.target.value)}
              style={{
                fontSize: "26px",
                fontWeight: 750,
                marginTop: "4px",
              }}
            />
          </div>
          <button
            className="drawer-close-button"
            onClick={onClose}
            aria-label="Close drawer"
          >
            ×
          </button>
        </div>

        {/* DESCRIPTION */}
        <section className="drawer-section">
          <h3>Description</h3>
          <textarea
            className="task-edit-textarea"
            value={task.description || ""}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Add a description..."
          />
        </section>

        {/* PEOPLE */}
        <section className="drawer-section">
          <h3>People</h3>
          <div className="drawer-info-grid">
            <div className="drawer-info-item">
              <span className="info-label">Responsible Person</span>
              <input
                className="info-value-input"
                value={task.responsiblePerson || ""}
                onChange={(event) => onResponsiblePersonChange(event.target.value)}
                placeholder="Responsible person"
              />
            </div>
            <div className="drawer-info-item">
              <span className="info-label">Assigned To</span>
              <input
                className="info-value-input"
                value={task.assignedTo || ""}
                onChange={(event) => onAssignedToChange(event.target.value)}
                placeholder="Assigned to"
              />
            </div>
          </div>
        </section>

        {/* DATES */}
        <section className="drawer-section">
          <h3>Dates</h3>
          <div className="drawer-date-grid">
            <div className="date-field">
              <label>Start Date</label>
              <input
                type="date"
                value={task.startDate || ""}
                onChange={(event) => onStartDateChange(event.target.value)}
              />
            </div>
            <div className="date-field">
              <label>Due Date</label>
              <input
                type="date"
                value={task.dueDate || ""}
                onChange={(event) => onDueDateChange(event.target.value)}
              />
            </div>
          </div>
          <div className="date-summary">
            <div>
              <span>Finish Date</span>
              <strong>{task.finishDate || "Not completed"}</strong>
            </div>
            <div>
              <span>Difference</span>
              <strong className={task.finishDate ? "difference-value" : "difference-pending"}>
                {difference}
              </strong>
            </div>
          </div>
        </section>

        {/* PRIORITY */}
        <section className="drawer-section">
          <div className="section-title-row">
            <h3>Priority</h3>
            <select
              className={`priority-select priority-${task.priority?.toLowerCase()}`}
              value={task.priority || "Medium"}
              onChange={(event) => onPriorityChange(event.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </section>

        {/* PROGRESS */}
        <section className="drawer-section">
          <div className="progress-header">
            <h3>Progress</h3>
            <strong>{progress}%</strong>
          </div>
          <div className="drawer-progress-background">
            <div
              className="drawer-progress-fill"
              style={{
                width: `${progress}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
          <p className="progress-description">
            {completedCount} of {task.miniTasks.length} mini tasks completed
          </p>
        </section>

        {/* MINI TASKS */}
        <section className="drawer-section">
          <div className="section-title-row">
            <h3>Mini Tasks</h3>
            <span className="mini-task-count">
              {completedCount}/{task.miniTasks.length}
            </span>
          </div>
          <MiniTaskList
            miniTasks={task.miniTasks}
            onToggle={onToggleMiniTask}
          />
          <AddMiniTask onAdd={onAddMiniTask} />
        </section>

        {/* NOTES */}
        <section className="drawer-section">
          <h3>Notes</h3>
          <textarea
            className="notes-textarea"
            value={task.notes || ""}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Write additional information..."
            rows={5}
          />
        </section>

        {/* DELETE */}
        <section className="drawer-section">
          <button className="delete-task-button" onClick={onDelete}>
            Delete Task
          </button>
        </section>
      </aside>
    </>
  );
}