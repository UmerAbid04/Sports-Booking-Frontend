import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosinstance';
import {
  FaUsers, FaBuilding, FaClock, FaRupeeSign, FaChartLine,
  FaCheckCircle, FaTimesCircle, FaBell, FaCog, FaUserCheck, FaTrash
} from 'react-icons/fa';
import '../styles/AdminPanel.css';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="admin-card">
    <div className="stat-icon-wrapper"><Icon className="stat-icon" /></div>
    <div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value || 0}</div>
      {trend && <div className="stat-trend positive"><FaChartLine /> {trend}</div>}
    </div>
  </div>
);

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [companySearch, setCompanySearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    approvalRate: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, companiesRes, usersRes] = await Promise.all([
          axiosInstance.get('/api/admin/dashboard/stats'),
          axiosInstance.get('/api/admin/companies'),
          axiosInstance.get('/api/admin/dashboard/users-summary'),
        ]);

        console.log("Fetched Companies:", companiesRes.data); // ✅ Debug

        setStats(prev => ({ ...prev, ...(statsRes.data || {}) }));
        const allCompanies = companiesRes.data?.companies || [];
        setPendingCompanies(allCompanies);
        setRecentUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data. Please try again later.');
        setPendingCompanies([]);
        setRecentUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveCompany = async (id) => {
  const company = pendingCompanies.find(c => c._id === id);

  // ✅ Frontend-side safety check before sending request
  if (!company?.user?._id) {
    console.warn("❌ Company has no user._id. Skipping approval.");
    alert("Company cannot be approved — missing user info.");
    return;
  }

  try {
    const response = await axiosInstance.patch(`/api/admin/companies/approve/${id}`);
    console.log("✅ Approved company:", response.data);
    setPendingCompanies(prev => prev.filter(c => c._id !== id));
  } catch (err) {
    console.error("Error approving company:", err.response?.data || err.message);
    alert("Failed to approve company. Please try again later.");
  }
};


  const handleRejectCompany = (id) => {
    setPendingCompanies(prev => prev.filter(c => c._id !== id));
  };

 

  const filteredCompanies = pendingCompanies.filter(c => {
    const nameMatch = c.companyName?.toLowerCase().includes(companySearch.toLowerCase());
    const locationMatch = c.location?.country?.toLowerCase().includes(companySearch.toLowerCase());
    return nameMatch || locationMatch;
  });

  const filteredUsers = recentUsers.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (loading) {
    return <div className="admin-container" style={{ paddingTop: '80px' }}><div className="loading-spinner">Loading...</div></div>;
  }

  if (error) {
    return (
      <div className="admin-container" style={{ paddingTop: '80px' }}>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }
  const RsIcon = () => <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Rs</span>;

  return (
    <div className="admin-container" style={{ paddingTop: '80px' }}>
      <div className="admin-header">
        <div>
          <div className="admin-title">Admin Panel</div>
          <div className="admin-subtitle">System Administration</div>
        </div>
        <div className="admin-header-actions">
          <button className="admin-icon-btn"><FaBell /></button>
          <button className="admin-icon-btn"><FaCog /></button>
          <div className="admin-avatar">AD</div>
        </div>
      </div>

     <div className="admin-cards">
  <StatCard
    title="Total Users"
    value={stats.totalUsers?.toLocaleString() || '0'}
    icon={FaUsers}
  />
  <StatCard
    title="Active Companies"
    value={stats.activeCompanies?.toLocaleString() || '0'}
    icon={FaBuilding}
  />
  <StatCard
    title="Pending Bookings"
    value={stats.pendingBookings || '0'}
    icon={FaClock}
  />
  <StatCard
    title="Total Revenue"
    value={`Rs ${(stats.totalRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
    icon={FaRupeeSign}
  />
  <StatCard
    title="Total Bookings"
    value={stats.totalBookings?.toLocaleString() || '0'}
    icon={FaChartLine}
  />
  <StatCard
    title="Total Grounds"
    value={stats.totalGrounds?.toLocaleString() || '0'}
    icon={FaBuilding}
  />
</div>


      <div className="admin-tabs">
        <button className={`admin-tab${activeTab === 'dashboard' ? ' active' : ''}`} onClick={() => setActiveTab('dashboard')}><FaClock /> Dashboard</button>
        <button className={`admin-tab${activeTab === 'companies' ? ' active' : ''}`} onClick={() => setActiveTab('companies')}><FaBuilding /> Companies</button>
        <button className={`admin-tab${activeTab === 'users' ? ' active' : ''}`} onClick={() => setActiveTab('users')}><FaUsers /> Users</button>
      </div>

      <div className="admin-section">
        {activeTab === 'companies' && (
  <div className="admin-card">
    <h3 className="admin-section-title">Company Management</h3>
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search companies..."
        value={companySearch}
        onChange={(e) => setCompanySearch(e.target.value)}
        className="search-input"
      />
    </div>
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Location</th>
            <th>Sports</th>
            <th>Submitted</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <tr key={company._id}>
                <td>{company.companyName || 'N/A'}</td>
                <td>{company.location?.country || 'N/A'}</td>
                <td>{company.sportsOffered?.join(', ') || 'N/A'}</td>
                <td>{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</td>
               <td>
  <span className={`admin-status-badge ${company.isActive ? 'approved' : 'pending'}`}>
    {company.isActive ? 'Approved' : 'Pending'}
  </span>
</td>
<td>
  {company.isActive ? (
    <span style={{ color: '#aaa' }}>N/A</span>
  ) : (
    <button className="admin-btn primary" onClick={() => handleApproveCompany(company._id)}>
      <FaCheckCircle />
    </button>
  )}
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No companies found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}


       {activeTab === 'users' && (
  <div className="admin-card">
    <h3 className="admin-section-title">User Management</h3>
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search users..."
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
        className="search-input"
      />
    </div>
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email || 'N/A'}</td>
                <td>{user.role || 'User'}</td>
                <td>
                  <span className={`admin-status-badge ${user.status?.toLowerCase() || 'active'}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#aaa' }}>N/A</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}


        {activeTab === 'dashboard' && (
          <div className="admin-card">
            <h3 className="admin-section-title">Dashboard Overview</h3>
            <p>Welcome to the admin dashboard. Use the tabs above to manage companies and users.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
