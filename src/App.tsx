import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { useAlert } from '@/components/ui/customAlert';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Login, Analytics, Users, Profile, Applications, System } from "@/imports";

function AppContent() {
  const { AlertContainer } = useAlert();
  
  return (
    <div>
      <AlertContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* ROTAS INDIVIDUAIS COM LAYOUT */}
        <Route path="/analytics" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/candidates" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Applications />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/system" element={
          <ProtectedRoute>
            <DashboardLayout>
              <System />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/analytics" />} />
        <Route path="*" element={<Navigate to="/analytics" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;