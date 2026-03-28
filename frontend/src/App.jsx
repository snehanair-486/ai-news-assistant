import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import PersonaPage from "./pages/PersonaPage";
import Dashboard from "./pages/Dashboard";
import "./index.css";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ni_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // After AuthPage: user exists but has no persona yet
  // After PersonaPage: user has persona, go to Dashboard

  const handleLogin = (u) => {
    // Don't save to localStorage yet — wait for persona selection
    setUser(u);
  };

  const handlePersonaSelect = (personaId) => {
    const updatedUser = { ...user, persona: personaId };
    localStorage.setItem("ni_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("ni_user");
    setUser(null);
  };

  // Stage 1: not logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Stage 2: logged in but no persona chosen yet
  if (!user.persona) {
    return <PersonaPage user={user} onPersonaSelect={handlePersonaSelect} />;
  }

  // Stage 3: fully set up
  return (
    <Dashboard
      key={user.email + user.persona}
      user={user}
      onLogout={handleLogout}
    />
  );
}