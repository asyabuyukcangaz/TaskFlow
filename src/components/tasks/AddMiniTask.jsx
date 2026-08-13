import { useState } from "react";

export default function AddMiniTask({
  onAdd,
}) {
  const [title, setTitle] = useState("");

  function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    onAdd(trimmed);
    setTitle("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="add-mini-task">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a mini task..."
      />
      <button type="button" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}