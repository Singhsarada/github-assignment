import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; 
import logo from "./logo.png"; 
const CACHE_KEY = "githubUsers";
const CACHE_DURATION = 2 * 60 * 1000; 

const App = () => {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  // Function to fetch data from the GitHub API
  const fetchData = async () => {
    try {
      setLoading(true); 
      const response = await axios.get("https://api.github.com/users"); 

      console.log(
        `API call made at: ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`
      );

      // Update the users state with fetched data
      setUsers(response.data);

      // Store the fetched data in localStorage with the current timestamp
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

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY)); 
    const now = new Date().getTime(); 

    // Check if cached data exists and is still valid (not expired)
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      //use it if valid data
      setUsers(cachedData.data); 
      setLoading(false); 
    } else {
      fetchData(); // Fetching new data if there is no cached data
    }

    // here i am giving the interval time to call the function
    const intervalId = setInterval(() => {
      console.log("2 minutes passed, fetching new data...");
      fetchData(); 
    }, CACHE_DURATION);

   // interval clearing
    return () => clearInterval(intervalId);
  }, []);

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
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <input
        type="text"
        placeholder="Search by username..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        <h1>Github Users</h1>
      </div>

    

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
