export function calculateProgress(miniTasks = []) {
  if (!miniTasks || miniTasks.length === 0) {
    return 0;
  }

  const completed = miniTasks.filter((miniTask) => miniTask.completed).length;
  return Math.round((completed / miniTasks.length) * 100);
}

export function getCompletedMiniTaskCount(miniTasks = []) {
  if (!miniTasks) return 0;
  return miniTasks.filter((miniTask) => miniTask.completed).length;
}

export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDifferenceText(dueDate, finishDate) {
  if (!dueDate || !finishDate) {
    return "—";
  }

  const due = new Date(`${dueDate}T00:00:00`);
  const finish = new Date(`${finishDate}T00:00:00`);
  const difference = Math.round((finish - due) / (1000 * 60 * 60 * 24));

  if (difference === 0) {
    return "On time";
  }

  if (difference < 0) {
    const days = Math.abs(difference);
    return `${days} ${days === 1 ? "day" : "days"} early`;
  }

  return `${difference} ${difference === 1 ? "day" : "days"} late`;
}

export function getProgressColor(progress) {
  const value = Math.max(0, Math.min(100, progress));
  
  // Red: 239, 68, 68
  // Green: 34, 197, 94
  // Yellow: 234, 179, 8
  
  let r, g, b;
  
  if (value <= 50) {
    // Red to Yellow (0% -> 50%)
    const ratio = value / 50;
    r = 239 - (239 - 234) * ratio;
    g = 68 + (179 - 68) * ratio;
    b = 68 - (68 - 8) * ratio;
  } else {
    // Yellow to Green (50% -> 100%)
    const ratio = (value - 50) / 50;
    r = 234 - (234 - 34) * ratio;
    g = 179 + (197 - 179) * ratio;
    b = 8 + (94 - 8) * ratio;
  }
  
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// YENİ FONKSİYONLAR

export function sortTasks(tasks, field, direction = 'asc') {
  const sorted = [...tasks];
  
  sorted.sort((a, b) => {
    let valA = a[field] || '';
    let valB = b[field] || '';
    
    // Özel durumlar
    if (field === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      valA = priorityOrder[valA] || 0;
      valB = priorityOrder[valB] || 0;
    } else if (field === 'dueDate' || field === 'startDate' || field === 'finishDate') {
      valA = valA ? new Date(valA).getTime() : 0;
      valB = valB ? new Date(valB).getTime() : 0;
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
}

export function filterTasks(tasks, filters) {
  let filtered = [...tasks];
  
  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  }
  
  // Field filters
  Object.keys(filters).forEach(key => {
    if (key !== 'search' && filters[key]) {
      filtered = filtered.filter(task => 
        task[key] && task[key].toLowerCase() === filters[key].toLowerCase()
      );
    }
  });
  
  return filtered;
}

export function getUniqueValues(tasks, field) {
  const values = new Set();
  tasks.forEach(task => {
    if (task[field]) {
      values.add(task[field]);
    }
  });
  return Array.from(values).sort();
}

export function calculateDuration(finishDate, dueDate) {
  if (!finishDate || !dueDate) return null;
  
  const finish = new Date(`${finishDate}T00:00:00`);
  const due = new Date(`${dueDate}T00:00:00`);
  const diff = Math.round((finish - due) / (1000 * 60 * 60 * 24));
  
  return diff;
}