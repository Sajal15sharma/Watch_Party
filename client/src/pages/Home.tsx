import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Home() {
  const navigate = useNavigate();

  const [createUsername, setCreateUsername] = useState('');
  const [creating, setCreating]             = useState(false);
  const [joinCode, setJoinCode]             = useState('');
  const [joinUsername, setJoinUsername]     = useState('');
  const [joining, setJoining]               = useState(false);
  const [error, setError]                   = useState('');
  const [activeTab, setActiveTab]           = useState<'create' | 'join'>('create');

  // Create room — REST call only. Room.tsx handles the socket join.
  const handleCreate = async () => {
    if (!createUsername.trim()) { setError('Enter your name first.'); return; }
    setError('');
    setCreating(true);
    try {
      const res  = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST', credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Persist username so Room.tsx can read it and emit join_room
      localStorage.setItem('wp_username', createUsername.trim());
      navigate(`/room/${data.code}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create room.');
    } finally {
      setCreating(false);
    }
  };

  // Join room — verify code exists via REST, then navigate. Room.tsx handles socket join.
  const handleJoin = async () => {
    if (!joinUsername.trim()) { setError('Enter your name first.'); return; }
    if (!joinCode.trim())     { setError('Enter a room code.'); return; }
    setError('');
    setJoining(true);
    try {
      const code = joinCode.trim().toUpperCase();
      const res  = await fetch(`${API_URL}/api/rooms/${code}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('wp_username', joinUsername.trim());
      navigate(`/room/${code}`);
    } catch (err: any) {
      setError(err.message || 'Room not found.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <>
      <div className="bg-gradient" />
      <div className="home-container">
        <div className="home-inner">

          <div className="home-header">
            <div className="home-logo">🎬</div>
            <h1 className="home-title">Watch Party</h1>
            <p className="home-subtitle">Watch YouTube videos in real-time sync with friends</p>
          </div>

          {/* Tab Switcher */}
          <div className="home-tabs">
            <button
              type="button"
              className={`home-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => { setActiveTab('create'); setError(''); }}
            >
              + Create Room
            </button>
            <button
              type="button"
              className={`home-tab-btn ${activeTab === 'join' ? 'active' : ''}`}
              onClick={() => { setActiveTab('join'); setError(''); }}
            >
              → Join Room
            </button>
          </div>

          {/* Main Card */}
          <div className="card">
            {activeTab === 'create' ? (
              <>
                <h2 className="card-title">✨ Create a room</h2>
                <p className="card-subtitle">
                  Become the host and receive a shareable 6-character room code.
                </p>
                <input
                  id="create-username"
                  type="text"
                  placeholder="Your display name"
                  value={createUsername}
                  maxLength={32}
                  onChange={e => setCreateUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  className="input"
                />
                <button
                  id="create-room-btn"
                  onClick={handleCreate}
                  disabled={creating}
                  className={`btn btn-primary btn-full mt-md ${creating ? 'btn-disabled' : ''}`}
                >
                  {creating ? 'Creating Room…' : '+ Create Room'}
                </button>
              </>
            ) : (
              <>
                <h2 className="card-title">🔑 Join a room</h2>
                <p className="card-subtitle">
                  Enter your name and the room code provided by your host.
                </p>
                <input
                  id="join-username"
                  type="text"
                  placeholder="Your display name"
                  value={joinUsername}
                  maxLength={32}
                  onChange={e => setJoinUsername(e.target.value)}
                  className="input mb-sm"
                />
                <input
                  id="join-code"
                  type="text"
                  placeholder="Room Code (e.g. A3F9KX)"
                  value={joinCode}
                  maxLength={6}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                  className="input input-code"
                />
                <button
                  id="join-room-btn"
                  onClick={handleJoin}
                  disabled={joining}
                  className={`btn btn-secondary btn-full mt-md ${joining ? 'btn-disabled' : ''}`}
                >
                  {joining ? 'Joining Room…' : 'Join Room →'}
                </button>
              </>
            )}

            {error && <p className="error-text">{error}</p>}
          </div>

        </div>
      </div>
    </>
  );
}