import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardTab = () => {
  const { currentUser, signOut } = useAuth();

  return (
    <div className="dashboard-tab">
      <p>
        Hello <strong>{currentUser?.name || currentUser?.email}</strong> (
        <span className="text-primary" onClick={signOut} style={{ cursor: "pointer" }}>
          not {currentUser?.name || currentUser?.email}? Log out
        </span>
        )
      </p>
      <p>
        From your account dashboard you can view your{" "}
        <span className="text-warning">recent orders</span>, manage your{" "}
        <span className="text-warning">shipping and billing addresses</span>, and{" "}
        <span className="text-warning">edit your password and account details</span>.
      </p>
    </div>
  );
};

export default DashboardTab;
