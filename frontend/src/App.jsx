import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");

  // Load feeds from backend API on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/feeds")
      .then((res) => res.json())
      .then((data) => setFeeds(data))
      .catch(() => setFeeds([]));
  }, []);

  // Save feeds to backend API
  const saveFeedToBackend = async (feed) => {
    try {
      const res = await fetch("http://localhost:5000/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feed),
      });
      if (res.ok) {
        const newFeed = await res.json();
        setFeeds((prev) => [newFeed, ...prev]);
      }
    } catch (err) {
      // handle error (optional)
    }
  };

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFeed = {
      title,
      content,
      username: username || "anonymous",
    };
    saveFeedToBackend(newFeed);
    setTitle("");
    setContent("");
    setUsername("");
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Feeds</h1>
      <button onClick={handleToggleForm} style={{ marginBottom: '1rem' }}>
        {showForm ? 'Cancel' : 'Create Feed'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Feed Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: '80%', padding: '8px', marginBottom: '0.5rem' }}
          />
          <br />
          <textarea
            placeholder="Feed Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            style={{ width: '80%', padding: '8px', minHeight: '60px', marginBottom: '0.5rem' }}
          />
          <br />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '80%', padding: '8px', marginBottom: '0.5rem' }}
          />
          <br />
          <button type="submit">Submit Feed</button>
        </form>
      )}
      <div>
        {feeds.length === 0 ? (
          <p>No feeds yet.</p>
        ) : (
          feeds.map(feed => (
            <div key={feed.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 16, textAlign: 'left' }}>
              <h3>{feed.title}</h3>
              <p>{feed.content}</p>
              <p style={{ fontStyle: 'italic', color: '#888' }}>By: {feed.username}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
