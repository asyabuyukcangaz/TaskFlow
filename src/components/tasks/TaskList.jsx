import { useState } from 'react';
import TaskCard from './TaskCard';
import { sortTasks, filterTasks, getUniqueValues } from '../../utils/taskUtils';

export default function TaskList({
  tasks,
  onTaskClick,
  onDeleteTask,
  onResponsiblePersonChange,
  onAssignedToChange,
}) {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Güvenlik kontrolü - tasks undefined ise boş array kullan
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Benzersiz değerleri al
  const uniqueResponsible = getUniqueValues(safeTasks, 'responsiblePerson');
  const uniqueAssigned = getUniqueValues(safeTasks, 'assignedTo');
  const uniquePriorities = ['High', 'Medium', 'Low'];

  // Sıralama ve filtreleme
  const filteredTasks = filterTasks(safeTasks, { ...filters, search: searchTerm });
  const sortedTasks = sortTasks(filteredTasks, sortField, sortDirection);

  // Sütun başlığına tıkla
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtre değişikliği
  const handleFilterChange = (field, value) => {
    if (value) {
      setFilters({ ...filters, [field]: value });
    } else {
      const newFilters = { ...filters };
      delete newFilters[field];
      setFilters(newFilters);
    }
  };

  // Filtre dropdown
  const renderFilterDropdown = (field, options, label) => {
    const currentValue = filters[field] || '';
    
    return (
      <div className="filter-dropdown">
        <select
          value={currentValue}
          onChange={(e) => handleFilterChange(field, e.target.value)}
        >
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="task-list-wrapper">
      {/* Search ve Filtreler */}
      <div className="task-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-container">
          {renderFilterDropdown('responsiblePerson', uniqueResponsible, 'Responsible')}
          {renderFilterDropdown('assignedTo', uniqueAssigned, 'Assigned To')}
          {renderFilterDropdown('priority', uniquePriorities, 'Priority')}
          {(searchTerm || Object.keys(filters).length > 0) && (
            <button 
              className="clear-filters"
              onClick={() => {
                setSearchTerm('');
                setFilters({});
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* COLUMN HEADERS */}
      <div className="task-table-header">
        <div className="task-header task-index-header">#</div>
        <div 
          className="task-header task-title-header sortable"
          onClick={() => handleSort('title')}
        >
          TASK
          {sortField === 'title' && (
            <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div 
          className="task-header sortable"
          onClick={() => handleSort('responsiblePerson')}
        >
          RESPONSIBLE
          {sortField === 'responsiblePerson' && (
            <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div 
          className="task-header sortable"
          onClick={() => handleSort('assignedTo')}
        >
          ASSIGNED TO
          {sortField === 'assignedTo' && (
            <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div 
          className="task-header sortable"
          onClick={() => handleSort('startDate')}
        >
          START
          {sortField === 'startDate' && (
            <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div 
          className="task-header sortable"
          onClick={() => handleSort('dueDate')}
        >
          DUE
          {sortField === 'dueDate' && (
            <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div 
          className="task-header sortable"
          onClick={() => handleSort('finishDate')}
        >
          FINISH
          {sortField === 'finishDate' && (
            <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div 
          className="task-header sortable"
          onClick={() => handleSort('finishDate')}
        >
          DIFFERENCE
          {sortField === 'finishDate' && (
            <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div className="task-header task-progress-header">PROGRESS</div>
        <div 
          className="task-header sortable"
          onClick={() => handleSort('priority')}
        >
          PRIORITY
          {sortField === 'priority' && (
            <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
      </div>

      {/* TASK ROWS */}
      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="empty-task-state">
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task.</p>
          </div>
        ) : (
          sortedTasks.map((task, index) => (
            <TaskCard
              key={task.id || index}
              task={task}
              index={index + 1}
              onClick={() => onTaskClick && onTaskClick(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}