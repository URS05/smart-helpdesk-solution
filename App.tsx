import React, { useState } from 'react';
import { UserRole, User, Ticket, TicketStatus } from './types';
import Login from './components/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import Chatbot from './components/Chatbot';
import { mockTickets, mockUsers } from './services/mockData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleCreateTicket = (newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'requester' | 'source' | 'comments' | 'status'>) => {
    const newTicket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      ...newTicketData,
      requester: currentUser!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'Web',
      comments: [],
      status: TicketStatus.OPEN,
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(prevTickets =>
      prevTickets.map(t =>
        t.id === updatedTicket.id
          ? { ...updatedTicket, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const renderDashboard = () => {
    if (!currentUser) {
        return <Login onLogin={handleLogin} />;
    }

    const dashboardProps = {
        currentUser,
        onLogout: handleLogout,
        allUsers: mockUsers,
        handleUpdateTicket,
    };

    switch (currentUser.role) {
      case UserRole.USER:
        return <UserDashboard {...dashboardProps} tickets={tickets.filter(t => t.requester.id === currentUser.id)} handleCreateTicket={handleCreateTicket} />;
      case UserRole.ADMIN:
        return <AdminDashboard {...dashboardProps} tickets={tickets} />;
      case UserRole.TECHNICIAN:
        const technicianVisibleTickets = tickets.filter(
            t => t.assignee?.id === currentUser.id || !t.assignee
        );
        return <TechnicianDashboard {...dashboardProps} tickets={technicianVisibleTickets} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="font-sans">
      {renderDashboard()}
      {currentUser && currentUser.role === UserRole.USER && <Chatbot currentUser={currentUser} handleCreateTicket={handleCreateTicket} />}
    </div>
  );
};

export default App;