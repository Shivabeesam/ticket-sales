import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  RefreshCw,
  Server,
  AlertCircle
} from 'lucide-react';
import StatsCard from './components/StatsCard';
import TaskModal from './components/TaskModal';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch backend data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthRes, tasksRes, statsRes] = await Promise.allSettled([
        fetch('/api/health'),
        fetch('/api/tasks'),
        fetch('/api/tasks/stats'),
      ]);

      if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
        setServerOnline(true);
      } else {
        setServerOnline(false);
      }

      if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
        const tasksData = await tasksRes.value.json();
        setTasks(tasksData);
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const statsData = await statsRes.value.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to communicate with API:', err);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        // Update
        const res = await fetch(`/api/tasks/${taskData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        if (res.ok) {
          fetchData();
          setIsModalOpen(false);
        }
      } else {
        // Create
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        if (res.ok) {
          fetchData();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = 
      task.status === 'PENDING' ? 'IN_PROGRESS' : 
      task.status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
    
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: nextStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">
            <Layers color="#fff" size={24} />
          </div>
          <div className="title-wrap">
            <h1>Java Fullstack Workspace</h1>
            <p>Spring Boot 3.4 REST API + React 18 Monorepo</p>
          </div>
        </div>

        <div className="header-status">
          <span 
            className="badge-server"
            style={{
              color: serverOnline ? 'var(--accent-success)' : 'var(--accent-danger)',
              background: serverOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              borderColor: serverOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <span 
              className="badge-dot" 
              style={{
                backgroundColor: serverOnline ? 'var(--accent-success)' : 'var(--accent-danger)',
                boxShadow: `0 0 8px ${serverOnline ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
              }}
            />
            {serverOnline ? 'Backend Connected (:8080)' : 'Backend Offline / Connecting...'}
          </span>
          <button className="btn btn-secondary" onClick={fetchData} title="Refresh Data">
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatsCard 
          label="Total Tasks" 
          value={stats.total} 
          icon={Layers} 
          accentColor="#6366f1" 
        />
        <StatsCard 
          label="Completed" 
          value={stats.completed} 
          icon={CheckCircle2} 
          accentColor="#10b981" 
        />
        <StatsCard 
          label="In Progress" 
          value={stats.inProgress} 
          icon={Clock} 
          accentColor="#f59e0b" 
        />
        <StatsCard 
          label="Pending" 
          value={stats.pending} 
          icon={AlertCircle} 
          accentColor="#94a3b8" 
        />
      </div>

      {/* Action / Search Bar */}
      <div className="action-bar">
        <div className="search-filter-group">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Tasks Grid */}
      {loading && tasks.length === 0 ? (
        <div className="empty-state">
          <p>Loading tasks from Spring Boot API...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            {search || filterStatus !== 'ALL'
              ? 'Try changing your search keywords or status filter.'
              : 'Click "New Task" above to add your first task to the backend!'}
          </p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((t) => (
            <div key={t.id} className="task-card">
              <div>
                <div className="task-header">
                  <h3 className="task-title">{t.title}</h3>
                  <span className={`priority-badge priority-${t.priority ? t.priority.toLowerCase() : 'medium'}`}>
                    {t.priority || 'MEDIUM'}
                  </span>
                </div>
                <p className="task-desc">{t.description || 'No description provided.'}</p>
              </div>

              <div className="task-footer">
                <span 
                  className={`status-badge status-${t.status}`}
                  onClick={() => handleToggleStatus(t)}
                  title="Click to cycle status"
                >
                  {t.status === 'COMPLETED' ? '✓ Completed' : t.status === 'IN_PROGRESS' ? '● In Progress' : '○ Pending'}
                </span>

                <div className="card-actions">
                  <button 
                    className="btn-icon" 
                    title="Edit task"
                    onClick={() => {
                      setEditingTask(t);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    className="btn-icon delete" 
                    title="Delete task"
                    onClick={() => handleDeleteTask(t.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
