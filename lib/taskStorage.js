const STORAGE_KEY = "taskflow_tasks";

export async function loadTasks() {
  // Önce localStorage'ı kontrol et
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored tasks:", error);
      }
    }
  }

  // localStorage'da yoksa JSON dosyasından yükle
  try {
    const response = await fetch("/data/tasks.json");
    if (!response.ok) {
      throw new Error("Failed to load tasks.json");
    }
    const data = await response.json();
    const tasks = data.tasks || [];

    // JSON'dan yüklenen veriyi localStorage'a kaydet
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    return tasks;
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
}

export function saveTasks(tasks) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    console.log("✅ Tasks saved to localStorage:", tasks.length, "tasks");
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}

export function clearStoredTasks() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("🗑️ Tasks cleared from localStorage");
  } catch (error) {
    console.error("Error clearing tasks:", error);
  }
}