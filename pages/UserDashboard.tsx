import React, { useState } from 'react';
import { Ticket, TicketStatus, User, TicketCategory, TicketPriority } from '../types';
import TicketModal from '../components/TicketModal';

interface UserDashboardProps {
  currentUser: User;
  tickets: Ticket[];
  handleCreateTicket: (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'requester' | 'source' | 'comments' | 'status'>) => void;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ tickets, handleCreateTicket, onLogout, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleOpenCreateModal = () => {
      setSelectedTicket(null);
      setIsModalOpen(true);
  };
  
  const handleOpenViewModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };
  
  const handleModalSubmit = (ticketData: any) => {
    handleCreateTicket(ticketData);
    setIsModalOpen(false);
  };
    
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return 'bg-blue-500 text-blue-100';
      case TicketStatus.IN_PROGRESS: return 'bg-yellow-500 text-yellow-100';
      case TicketStatus.RESOLVED: return 'bg-green-500 text-green-100';
      case TicketStatus.CLOSED: return 'bg-gray-500 text-gray-100';
      case TicketStatus.PENDING: return 'bg-purple-500 text-purple-100';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 text-white min-h-screen">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <p className="text-gray-400">Welcome, {currentUser.name}. View and manage your support requests.</p>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={handleOpenCreateModal} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition">
              Create New Ticket
            </button>
            <button onClick={onLogout} className="px-4 py-2 font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 transition">
              Logout
            </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tickets.map(ticket => (
          <div key={ticket.id} onClick={() => handleOpenViewModal(ticket)} className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg text-white">{ticket.title}</span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-gray-400 mb-4 h-12 overflow-hidden">{ticket.description}</p>
            <div className="border-t border-gray-700 pt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Ticket ID: <span className="font-mono text-gray-300">{ticket.id}</span></span>
                <span>Priority: <span className="font-semibold text-gray-300">{ticket.priority}</span></span>
              </div>
              <div className="mt-2">
                Last updated: {new Date(ticket.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
          <TicketModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            initialData={selectedTicket}
            isReadOnly={selectedTicket !== null}
            currentUser={currentUser}
          />
      )}
    </div>
  );
};

export default UserDashboard;
