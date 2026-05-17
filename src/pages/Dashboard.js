import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProjects, getUpdates } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [updates, setUpdates] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
      // Fetch updates for each project
      for (const project of data) {
        const res = await getUpdates(project.id);
        setUpdates(prev => ({ ...prev, [project.id]: res.data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      in_progress: '#3498db',
      review: '#9b59b6',
      completed: '#2ecc71',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#999';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>👋 Welcome, {user?.name}</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Your Projects</h2>
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p style={styles.empty}>No projects yet. We'll get started soon!</p>
        ) : (
          projects.map(project => (
            <div key={project.id} style={styles.projectCard}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>{project.title}</h3>
                <span style={{ ...styles.status, background: getStatusColor(project.status) }}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p style={styles.description}>{project.description}</p>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${project.progress}%` }} />
              </div>
              <p style={styles.progressText}>{project.progress}% Complete</p>
              {project.budget && <p style={styles.budget}>💰 Budget: ${project.budget}</p>}
              {project.deadline && <p style={styles.deadline}>📅 Deadline: {project.deadline}</p>}

              {/* Project Updates */}
              {updates[project.id]?.length > 0 && (
                <div style={styles.updates}>
                  <h4 style={styles.updatesTitle}>Latest Updates</h4>
                  {updates[project.id].map(update => (
                    <div key={update.id} style={styles.update}>
                      <p style={styles.updateMessage}>• {update.message}</p>
                      <p style={styles.updateDate}>{new Date(update.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f5f6fa' },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px 40px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center'
  },
  headerTitle: { color: 'white', margin: 0 },
  logoutBtn: {
    padding: '8px 20px', background: 'rgba(255,255,255,0.2)',
    color: 'white', border: '1px solid white',
    borderRadius: '8px', cursor: 'pointer'
  },
  content: { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  sectionTitle: { color: '#333', marginBottom: '24px' },
  empty: { color: '#999', fontSize: '18px' },
  projectCard: {
    background: 'white', padding: '24px',
    borderRadius: '12px', marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  projectHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  projectTitle: { margin: 0, color: '#333' },
  status: { padding: '4px 12px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: 'bold' },
  description: { color: '#666', marginBottom: '16px' },
  progressBar: { background: '#f0f0f0', borderRadius: '10px', height: '8px', marginBottom: '8px' },
  progressFill: { background: '#667eea', height: '8px', borderRadius: '10px', transition: 'width 0.3s' },
  progressText: { color: '#666', fontSize: '14px' },
  budget: { color: '#27ae60', fontSize: '14px' },
  deadline: { color: '#e67e22', fontSize: '14px' },
  updates: { marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' },
  updatesTitle: { color: '#333', marginBottom: '8px' },
  update: { marginBottom: '8px' },
  updateMessage: { color: '#555', margin: 0 },
  updateDate: { color: '#999', fontSize: '12px', margin: 0 }
};

export default Dashboard;