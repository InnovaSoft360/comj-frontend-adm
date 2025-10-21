import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, Analytics, Users, Profile, Applications, System } from "@/imports";

function App() {
  const isAuthenticated = true; // SEMPRE TRUE PRA TESTAR

  return (
    <div>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/analytics" /> : <Login />} />
        <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
        <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/candidates" element={isAuthenticated ? <Applications /> : <Navigate to="/login" />} />
        <Route path="/system" element={isAuthenticated ? <System /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/analytics" />} />
      </Routes>
    </div>
  );
}

export default App;