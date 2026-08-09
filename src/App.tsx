import React from 'react';
import { useAuthViewModel } from './viewmodels/useAuthViewModel';
import { AuthView } from './views/AuthView';
import { WeatherView } from './views/WeatherView';
import './App.css';

function App() {
  const { user, loading, logout } = useAuthViewModel();

  if (loading) {
    return (
      <div className="App">
        <p className="app-loading" role="status">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? <WeatherView user={user} onLogout={logout} /> : <AuthView />}
    </div>
  );
}

export default App;
