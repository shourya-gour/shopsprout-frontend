import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import { getProjects, createProject, updateProject, getContacts, getServices, createService, getAgreements } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user, logoutUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [services, setServices] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [newProject, setNewProject] = useState({ client_id: '', title: '', description: '', budget: '', deadline: '' });
  const [newService, setNewService] = useState({ title: '', description: '', price: '', duration: '' });
  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [p, c, s, a] = await Promise.all([getProjects(), getContacts(), getServices(), getAgreements()]);
      setProjects(p.data);
      setContacts(c.data);
      setServices(s.data);
      setAgreements(a.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setNewProject({ client_id: '', title: '', description: '', budget: '', deadline: '' });
      fetchAll();
      alert('Project created!');
    } catch (err) { alert(err.response?.data?.error || 'Error creating project'); }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await createService(newService);
      setNewService({ title: '', description: '', price: '', duration: '' });
      fetchAll();
      alert('Service created!');
    } catch (err) { alert(err.response?.data?.error || 'Error creating service'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const project = projects.find(p => p.id === id);
      await updateProject(id, { ...project, status, progress: project.progress });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleProgressChange = async (id, progress) => {
    try {
      const project = projects.find(p => p.id === id);
      await updateProject(id, { ...project, progress: parseInt(progress) });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  const getStatusColor = (status) => {
    const colors = { pending: '#f39c12', in_progress: '#3498db', review: '#9b59b6', completed: '#2ecc71', cancelled: '#e74c3c' };
    return colors[status] || '#999';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>⚡ Admin Panel</h1>
        <div style={styles.headerRight}>
          <span style={styles.adminName}>👤 {user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.tabs}>
        {['projects', 'contacts', 'services', 'agreements'].map(tab => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.content}>

        {activeTab === 'projects' && (
          <div>
            <h2 style={styles.sectionTitle}>Create New Project</h2>
            <form onSubmit={handleCreateProject} style={styles.form}>
              <input style={styles.input} placeholder="Client ID" value={newProject.client_id}
                onChange={e => setNewProject({ ...newProject, client_id: e.target.value })} required />
              <input style={styles.input} placeholder="Project Title" value={newProject.title}
                onChange={e => setNewProject({ ...newProject, title: e.target.value })} required />
              <input style={styles.input} placeholder="Description" value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
              <input style={styles.input} placeholder="Budget ($)" type="number" value={newProject.budget}
                onChange={e => setNewProject({ ...newProject, budget: e.target.value })} />
              <input style={styles.input} placeholder="Deadline" type="date" value={newProject.deadline}
                onChange={e => setNewProject({ ...newProject, deadline: e.target.value })} />
              <button style={styles.button} type="submit">Create Project</button>
            </form>
            <h2 style={styles.sectionTitle}>All Projects ({projects.length})</h2>
            {projects.map(project => (
              <div key={project.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{project.title}</h3>
                  <select
                    style={{ ...styles.statusSelect, background: getStatusColor(project.status) }}
                    value={project.status}
                    onChange={e => handleStatusChange(project.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <p style={styles.cardText}>Client ID: {project.client_id}</p>
                <p style={styles.cardText}>{project.description}</p>
                {project.budget && <p style={styles.cardText}>💰 ${project.budget}</p>}
                {project.deadline && <p style={styles.cardText}>📅 {project.deadline}</p>}
                <input
                  type="range" min="0" max="100"
                  value={project.progress}
                  onChange={e => handleProgressChange(project.id, e.target.value)}
                  style={{ width: '100%', marginTop: '8px' }}
                />
                <p style={styles.cardText}>Progress: {project.progress}%</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h2 style={styles.sectionTitle}>Contact Inquiries ({contacts.length})</h2>
            {contacts.length === 0
              ? <p style={styles.empty}>No contacts yet</p>
              : contacts.map(contact => (
                <div key={contact.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{contact.name}</h3>
                  <p style={styles.cardText}>📧 {contact.email}</p>
                  {contact.company && <p style={styles.cardText}>🏢 {contact.company}</p>}
                  <p style={styles.cardText}>{contact.message}</p>
                  <span style={{ ...styles.statusBadge, background: contact.status === 'new' ? '#e74c3c' : '#2ecc71' }}>
                    {contact.status}
                  </span>
                </div>
              ))
            }
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <h2 style={styles.sectionTitle}>Create New Service</h2>
            <form onSubmit={handleCreateService} style={styles.form}>
              <input style={styles.input} placeholder="Service Title" value={newService.title}
                onChange={e => setNewService({ ...newService, title: e.target.value })} required />
              <input style={styles.input} placeholder="Description" value={newService.description}
                onChange={e => setNewService({ ...newService, description: e.target.value })} />
              <input style={styles.input} placeholder="Price ($)" type="number" value={newService.price}
                onChange={e => setNewService({ ...newService, price: e.target.value })} />
              <input style={styles.input} placeholder="Duration (e.g. 1 week)" value={newService.duration}
                onChange={e => setNewService({ ...newService, duration: e.target.value })} />
              <button style={styles.button} type="submit">Create Service</button>
            </form>
            <h2 style={styles.sectionTitle}>All Services ({services.length})</h2>
            {services.map(service => (
              <div key={service.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{service.title}</h3>
                <p style={styles.cardText}>{service.description}</p>
                {service.price && <p style={styles.cardText}>💰 ${service.price}</p>}
                {service.duration && <p style={styles.cardText}>⏱ {service.duration}</p>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'agreements' && (
          <div>
            <h2 style={styles.sectionTitle}>Signed Agreements ({agreements.length})</h2>
            {agreements.length === 0
              ? <p style={styles.empty}>No agreements yet</p>
              : agreements.map(agreement => (
                <div key={agreement.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{agreement.client_name}</h3>
                    <span style={{ ...styles.statusBadge, background: '#2ecc71' }}>
                      ✅ {agreement.status}
                    </span>
                  </div>
                  <p style={styles.cardText}>📧 {agreement.client_email}</p>
                  {agreement.company && <p style={styles.cardText}>🏢 {agreement.company}</p>}
                  <p style={styles.cardText}>📦 Plan: <strong>{agreement.plan}</strong></p>
                  <p style={styles.cardText}>💰 Monthly: <strong>${agreement.monthly_retainer}</strong></p>
                  <p style={styles.cardText}>📊 Revenue Share: <strong>{agreement.revenue_percentage}%</strong></p>
                  <p style={styles.cardText}>📅 Signed: {new Date(agreement.agreed_at).toLocaleDateString()}</p>
                  <img src={agreement.signature} alt="Signature" style={styles.signature} />
                </div>
              ))
            }
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f5f6fa' },
  header: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    padding: '20px 40px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center'
  },
  headerTitle: { color: 'white', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  adminName: { color: 'white' },
  logoutBtn: {
    padding: '8px 20px', background: 'rgba(255,255,255,0.2)',
    color: 'white', border: '1px solid white',
    borderRadius: '8px', cursor: 'pointer'
  },
  tabs: { display: 'flex', background: 'white', padding: '0 40px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexWrap: 'wrap' },
  tab: {
    padding: '16px 24px', border: 'none', background: 'none',
    cursor: 'pointer', fontSize: '16px', color: '#666', textTransform: 'capitalize'
  },
  activeTab: { color: '#3498db', borderBottom: '2px solid #3498db' },
  content: { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  sectionTitle: { color: '#333', marginBottom: '20px' },
  form: { background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  input: {
    width: '100%', padding: '12px', marginBottom: '12px',
    border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '16px', boxSizing: 'border-box'
  },
  button: {
    padding: '12px 24px', background: '#3498db',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer'
  },
  card: {
    background: 'white', padding: '24px', borderRadius: '12px',
    marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cardTitle: { margin: 0, color: '#333' },
  cardText: { color: '#666', margin: '4px 0' },
  statusSelect: { padding: '6px 12px', borderRadius: '20px', color: 'white', border: 'none', cursor: 'pointer' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', color: 'white', fontSize: '12px' },
  empty: { color: '#999', fontSize: '18px' },
  signature: { width: '100%', maxWidth: '300px', border: '1px solid #eee', borderRadius: '8px', marginTop: '12px' }
};

export default Admin;