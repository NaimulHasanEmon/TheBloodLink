import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { toast } from 'react-hot-toast';

// AdminRoute ensures that only admin users can access the specified routes
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Check if the user is logged in
  if (!user) {
    toast.error("Please log in to access admin features");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // Hardcoded admin emails for now
  const adminEmails = ['mustakimemon1272000@gmail.com', 'thebloodlink01@gmail.com'];
  const isAdmin = adminEmails.includes(user.email);
  
  // Redirect non-admin users
  if (!isAdmin) {
    toast.error("You don't have admin privileges");
    return <Navigate to="/" />;
  }
  
  return children;
};

export default AdminRoute; 