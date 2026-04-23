import { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Edit2, Check, X, FileText, Settings, AlertCircle, User, Lock } from 'lucide-react';
import api from '../api';

interface Note {
  _id: string;
  note: string;
  createdAt: string;
}

interface DecodedToken {
  id: string;
  email: string;
}

interface DashboardProps {
  onLogout: () => void;
}

function decodeToken(): DecodedToken | null {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    // JWT tokens have 3 parts separated by dots; the payload is the second part
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return { id: payload.id, email: payload.email };
  } catch {
    return null;
  }
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Settings panel state
  const [showSettings, setShowSettings] = useState(false);
  const [settingsUsername, setSettingsUsername] = useState('');
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const decoded = decodeToken();

  useEffect(() => {
    if (decoded) {
      setSettingsEmail(decoded.email || '');
    }
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes/all');
      if (res.data.success) {
        setNotes(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const res = await api.post('/notes/create', { note: newNote });
      if (res.data.success) {
        setNewNote('');
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/notes/delete/${id}`);
      if (res.data.success) {
        setNotes(notes.filter(n => n._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note._id);
    setEditContent(note.note);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async (id: string) => {
    if (!editContent.trim()) return;

    try {
      const res = await api.put(`/notes/update/${id}`, { note: editContent });
      if (res.data.success) {
        setNotes(notes.map(n => n._id === id ? { ...n, note: editContent } : n));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // ---- Settings handlers ----
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decoded) return;
    setSettingsLoading(true);
    setSettingsMsg(null);

    try {
      const body: Record<string, string> = {};
      if (settingsUsername.trim()) body.username = settingsUsername.trim();
      if (settingsEmail.trim()) body.email = settingsEmail.trim();

      const res = await api.put(`/api/user/${decoded.id}`, body);
      if (res.data.success) {
        setSettingsMsg({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err: any) {
      setSettingsMsg({ type: 'error', text: err.response?.data?.msg || 'Failed to update profile.' });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decoded) return;
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put(`/api/user/${decoded.id}`, { currentPassword, newPassword });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.msg || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!decoded) return;
    setSettingsLoading(true);
    setSettingsMsg(null);

    try {
      const res = await api.delete(`/api/user/${decoded.id}`);
      if (res.data.success) {
        onLogout();
      }
    } catch (err: any) {
      setSettingsMsg({ type: 'error', text: err.response?.data?.msg || 'Failed to delete account.' });
      setSettingsLoading(false);
    }
  };

  const openSettings = () => {
    setShowSettings(true);
    setSettingsMsg(null);
    setDeleteConfirm(false);
  };

  const closeSettings = () => {
    setShowSettings(false);
    setSettingsMsg(null);
    setDeleteConfirm(false);
  };

  const avatarInitial = (settingsEmail || decoded?.email || '?')[0].toUpperCase();

  return (
    <div className="dashboard animate-fade-in">
      <div className="container">
        <nav className="navbar">
          <div className="logo">
            <FileText className="logo-icon" size={28} />
            <span>NovaNotes</span>
          </div>
          <div className="navbar-actions">
            <button onClick={openSettings} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button onClick={onLogout} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <main>
          <div className="create-note-area animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleCreateNote} className="create-note-box">
              <textarea
                className="note-textarea"
                placeholder="What's on your mind? Type a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateNote(e);
                  }
                }}
              />
              <div className="create-note-footer">
                <button type="submit" className="btn btn-primary" disabled={!newNote.trim()}>
                  <Plus size={18} /> Add Note
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <div className="spinner"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#475569' }}>
                <FileText size={48} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No notes yet</h3>
              <p>Create your first note using the input above.</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note, index) => (
                <div
                  key={note._id}
                  className="note-card animate-fade-in"
                  style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
                >
                  {editingId === note._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <textarea
                        className="note-textarea"
                        style={{ flexGrow: 1, marginBottom: '1rem' }}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto' }}>
                        <button onClick={cancelEdit} className="btn-icon">
                          <X size={18} />
                        </button>
                        <button onClick={() => saveEdit(note._id)} className="btn-icon" style={{ color: 'var(--success)' }}>
                          <Check size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="note-content">{note.note}</div>
                      <div className="note-footer">
                        <span>{formatDate(note.createdAt || new Date().toISOString())}</span>
                        <div className="note-actions">
                          <button onClick={() => startEdit(note)} className="btn-icon">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(note._id)} className="btn-icon danger">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Settings Panel Overlay */}
      {showSettings && (
        <div className="settings-overlay" onClick={closeSettings}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2>Account Settings</h2>
              <button onClick={closeSettings} className="btn-icon">
                <X size={22} />
              </button>
            </div>

            <div className="settings-avatar">{avatarInitial}</div>

            {settingsMsg && (
              <div className={`message ${settingsMsg.type}`}>
                <AlertCircle size={18} />
                <span>{settingsMsg.text}</span>
              </div>
            )}

            {/* Update Profile Section */}
            <div className="settings-section">
              <h3>Profile Information</h3>
              <form className="settings-form" onSubmit={handleUpdateUser}>
                <div className="settings-field">
                  <label htmlFor="settings-username">Username</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input
                      id="settings-username"
                      type="text"
                      placeholder="New username"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={settingsUsername}
                      onChange={(e) => setSettingsUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="settings-field">
                  <label htmlFor="settings-email">Email</label>
                  <div style={{ position: 'relative' }}>
                    <Settings style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input
                      id="settings-email"
                      type="email"
                      placeholder="New email"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={settingsLoading}>
                  {settingsLoading ? <div className="spinner"></div> : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Change Password Section */}
            <div className="settings-section">
              <h3>Change Password</h3>
              {passwordMsg && (
                <div className={`message ${passwordMsg.type}`}>
                  <AlertCircle size={18} />
                  <span>{passwordMsg.text}</span>
                </div>
              )}
              <form className="settings-form" onSubmit={handleChangePassword}>
                <div className="settings-field">
                  <label htmlFor="current-password">Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="settings-field">
                  <label htmlFor="new-password">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="settings-field">
                  <label htmlFor="confirm-password">Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                  {passwordLoading ? <div className="spinner"></div> : 'Change Password'}
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="settings-section">
              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>Permanently delete your account and all of your notes. This action cannot be undone.</p>
                {!deleteConfirm ? (
                  <button className="btn-danger" onClick={() => setDeleteConfirm(true)}>
                    <Trash2 size={16} /> Delete Account
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ color: 'var(--danger)', fontWeight: 500, fontSize: '0.9rem' }}>
                      Are you sure? This will permanently delete your account.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button className="btn-danger" onClick={handleDeleteAccount} disabled={settingsLoading}>
                        {settingsLoading ? <div className="spinner"></div> : 'Yes, Delete'}
                      </button>
                      <button className="btn btn-outline" onClick={() => setDeleteConfirm(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

