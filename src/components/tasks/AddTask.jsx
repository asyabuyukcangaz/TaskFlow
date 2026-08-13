import { useState } from "react";

export default function AddTask({
  onClose,
  onCreate,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [miniTasks, setMiniTasks] = useState([]);
  const [newMiniTask, setNewMiniTask] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    if (!dueDate) {
      alert("Please select a due date.");
      return;
    }

    onCreate({
      title: title.trim(),
      description: description.trim(),
      responsiblePerson: responsiblePerson.trim(),
      assignedTo: assignedTo.trim(),
      startDate,
      dueDate,
      priority,
      miniTasks,
    });
  }

  function addMiniTask() {
    const trimmed = newMiniTask.trim();
    if (!trimmed) {
      return;
    }

    setMiniTasks((current) => [
      ...current,
      {
        id: Date.now() + Math.random(),
        title: trimmed,
        completed: false,
      },
    ]);

    setNewMiniTask("");
  }

  function removeMiniTask(id) {
    setMiniTasks((current) =>
      current.filter((miniTask) => miniTask.id !== id)
    );
  }

  function handleMiniTaskKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addMiniTask();
    }
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="add-task-modal">
        <div className="add-task-modal-header">
          <h2>Create New Task</h2>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form className="add-task-form" onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="form-group">
            <label>Task Title</label>
            <input
              className="form-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter task title..."
              autoFocus
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what needs to be done..."
            />
          </div>

          {/* PEOPLE */}
          <div className="form-two-columns">
            <div className="form-group">
              <label>Responsible Person</label>
              <input
                className="form-input"
                value={responsiblePerson}
                onChange={(event) => setResponsiblePerson(event.target.value)}
                placeholder="Who is responsible?"
              />
            </div>

            <div className="form-group">
              <label>Assigned To</label>
              <input
                className="form-input"
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
                placeholder="Assign to..."
              />
            </div>
          </div>

          {/* DATES */}
          <div className="form-two-columns">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
          </div>

          {/* PRIORITY */}
          <div className="form-group">
            <label>Priority</label>
            <div className="priority-buttons">
              {["High", "Medium", "Low"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`priority-button ${
                    priority === option ? `active ${option.toLowerCase()}` : ""
                  }`}
                  onClick={() => setPriority(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* MINI TASKS */}
          <div className="form-group">
            <label>Mini Tasks</label>

            {miniTasks.length > 0 && (
              <div className="form-mini-tasks">
                {miniTasks.map((miniTask) => (
                  <div key={miniTask.id} className="form-mini-task">
                    <span>{miniTask.title}</span>
                    <button
                      type="button"
                      className="remove-mini-task"
                      onClick={() => removeMiniTask(miniTask.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="add-form-mini-task">
              <input
                value={newMiniTask}
                onChange={(event) => setNewMiniTask(event.target.value)}
                onKeyDown={handleMiniTaskKeyDown}
                placeholder="Add a mini task..."
              />
              <button type="button" onClick={addMiniTask}>
                +
              </button>
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="add-task-modal-footer">
          <button
            type="button"
            className="modal-cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-create-button"
            onClick={handleSubmit}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}