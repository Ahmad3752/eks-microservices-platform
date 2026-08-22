import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '';
const ACCENTS = [
  '#4f46e5', '#7c3aed', '#06b6d4', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899', '#0ea5e9',
];

export default function App() {
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  /* ── fetch ── */
  const fetchItems = async () => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/items`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      setItems(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  /* ── add ── */
  const addItem = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error(`Add failed: ${res.status}`);
      const newItem = await res.json();
      setItems((prev) => [...prev, newItem]);
      setNewName('');
    } catch (err) {
      setError(err.message);
    }
  };

  /* ── delete ── */
  const deleteItem = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  /* ── toggle done ── */
  const toggleDone = async (item) => {
    try {
      const res = await fetch(`${API_URL}/api/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !item.done }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    } catch (err) {
      setError(err.message);
    }
  };

  /* ── save edit ── */
  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      setEditId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <h1>Task Manager</h1>
        <p>Track your microservices journey</p>
        <div className="stats">
          <span className="stat">{items.length} total</span>
          <span className="stat">{doneCount} done</span>
          <span className="stat">{items.length - doneCount} pending</span>
        </div>
      </header>

      {/* ── Progress bar ── */}
      {items.length > 0 && (
        <div className="progress-wrap" title={`${progress}% complete`}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="error-bar">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* ── Add form ── */}
      <form className="add-form" onSubmit={addItem}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a new item…"
        />
        <button className="btn btn-add" type="submit" disabled={!newName.trim()}>
          + Add
        </button>
      </form>

      {/* ── List ── */}
      {loading ? (
        <p className="loading">Loading…</p>
      ) : items.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p>No items yet. Add one above.</p>
        </div>
      ) : (
        <ul className="items-list">
          {items.map((item, idx) => (
            <li
              key={item.id}
              className={`item-card${item.done ? ' done' : ''}`}
              style={{ '--accent': ACCENTS[idx % ACCENTS.length] }}
            >
              <span className="item-number">{idx + 1}</span>

              {editId === item.id ? (
                /* ── inline edit mode ── */
                <>
                  <input
                    className="item-edit-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(item.id);
                      if (e.key === 'Escape') setEditId(null);
                    }}
                    autoFocus
                  />
                  <div className="item-actions">
                    <button
                      className="action-btn btn-save-action"
                      onClick={() => saveEdit(item.id)}
                    >
                      Save
                    </button>
                    <button
                      className="action-btn btn-cancel-action"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                /* ── normal mode ── */
                <>
                  <span className="item-name">{item.name}</span>
                  <div className="item-actions">
                    <button
                      className={`action-btn btn-done-action${item.done ? ' is-done' : ''}`}
                      onClick={() => toggleDone(item)}
                      title={item.done ? 'Mark as pending' : 'Mark as done'}
                    >
                      {item.done ? '✓ Done' : 'Done?'}
                    </button>
                    <button
                      className="action-btn btn-edit-action"
                      onClick={() => { setEditId(item.id); setEditName(item.name); }}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn btn-delete-action"
                      onClick={() => deleteItem(item.id)}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
