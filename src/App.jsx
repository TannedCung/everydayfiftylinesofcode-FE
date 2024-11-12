import { useState, useEffect } from 'react';
import './App.css';
import SignIn from './pages/Login'; // Import the SignIn component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking if a token/session exists
    const token = localStorage.getItem('auth_token'); // Example check, replace as necessary
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear session/token and update the logged-in state
    localStorage.removeItem('auth_token'); // Example token removal
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <h1>Welcome to Developer Commitment Tracker</h1>
      {!isLoggedIn ? (
        <SignIn /> // Display the SignIn component if the user is not logged in
      ) : (
        <>
          <h2>Welcome back, Developer!</h2>
          <button onClick={handleLogout}>Log Out</button>
        </>
      )}
    </div>
  );
}

export default App;
