import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const CACHE_KEY = "githubUsers";
const CACHE_DURATION = 2 * 60 * 1000; // fro testing i give it 2 min dutration
const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    const now = new Date().getTime();

    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {  
      setUsers(cachedData.data);
      setLoading(false);
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get current date and time
      const now = new Date();
      console.log(
        `API call made at: ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`
      );

      const response = await axios.get("https://api.github.com/users");
      setUsers(response.data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: response.data, timestamp: new Date().getTime() })
      );
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.login.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1>Rabbit M Github Users</h1>
      <input
        type="text"
        placeholder="Search by username..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Additionaly i am adding No user found message  */}
      {filteredUsers.length === 0 ? (
        <div className="no-user">No user found.</div>
      ) : (
        <div className="user-grid">
          {filteredUsers.map((user) => (
            <div key={user.id} className="user-card">
              <img src={user.avatar_url} alt={user.login} className="avatar" />
              <h3>{user.login}</h3>
              <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                View Profile
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
