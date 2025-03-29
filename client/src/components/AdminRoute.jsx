import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../providers/AuthProvider';
import { FaSpinner } from 'react-icons/fa';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-primary text-4xl mx-auto" />
          <p className="mt-2 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (user && isAdmin) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute; 