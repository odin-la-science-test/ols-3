import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Plus, Trash2, ListTodo } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('taskList');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('taskList', JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        createdAt: new Date().toISOString()
      };
      saveTasks([task, ...tasks]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '2rem' }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          cursor: 'pointer',
          padding: '1rem',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ListTodo size={20} style={{ color: '#6366f1' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
            Tâches du jour
          </h3>
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            {completedCount}/{tasks.length}
          </span>
        </div>
        <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
          {isExpanded ? '−' : '+'}
        </span>
      </div>

      {isExpanded && (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Nouvelle tâche..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={addTask}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600
              }}
            >
              <Plus size={18} />
              Ajouter
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '2rem' }}>
                Aucune tâche pour le moment
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: task.completed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s'
                  }}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: task.completed ? '#10b981' : 'rgba(255,255,255,0.3)',
                      padding: 0,
                      display: 'flex'
                    }}
                  >
                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </button>
                  <p style={{
                    flex: 1,
                    margin: 0,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.5 : 1
                  }}>
                    {task.text}
                  </p>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      color: '#ef4444',
                      display: 'flex'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
