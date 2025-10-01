import React, { useState } from 'react';
import { Ticket, User, TicketStatus, TicketPriority } from '../types';
import TicketModal from '../components/TicketModal';

interface AdminDashboardProps {
  currentUser: User;
  tickets: Ticket[];
  handleUpdateTicket: (ticket: Ticket) => void;
  onLogout: () => void;
  allUsers: User[];
}

const StatCard: React.FC<{ title: string; value: number | string; color: string }> = ({ title, value, color }) => (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-md`}>
        <p className="text-sm text-gray-400">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, tickets, handleUpdateTicket, onLogout, allUsers }) => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === TicketStatus.OPEN).length;
    const inProgressTickets = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
    const pendingTickets = tickets.filter(t => t.status === TicketStatus.PENDING).length;

    const handleOpenModal = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedTicket(null);
        setIsModalOpen(false);
    };
    
    const handleModalSubmit = (updatedTicketData: Ticket) => {
        handleUpdateTicket(updatedTicketData);
        handleCloseModal();
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

    const getPriorityColor = (priority: TicketPriority) => {
        switch (priority) {
            case TicketPriority.URGENT: return 'text-red-400';
            case TicketPriority.HIGH: return 'text-amber-400';
            case TicketPriority.MEDIUM: return 'text-yellow-400';
            case TicketPriority.LOW: return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 text-white min-h-screen">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-400">Welcome, {currentUser.name}. Overview of all support tickets.</p>
                </div>
                <button onClick={onLogout} className="px-4 py-2 font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 transition">
                    Logout
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Tickets" value={totalTickets} color="text-blue-400" />
                <StatCard title="Open" value={openTickets} color="text-green-400" />
                <StatCard title="In Progress" value={inProgressTickets} color="text-yellow-400" />
                <StatCard title="Pending" value={pendingTickets} color="text-purple-400" />
            </div>

            {/* Tickets Table */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticket ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Requester</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assignee</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {tickets.map(ticket => (
                                <tr key={ticket.id} onClick={() => handleOpenModal(ticket)} className="hover:bg-gray-700/50 cursor-pointer transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{ticket.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{ticket.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.requester.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.assignee?.name || 'Unassigned'}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedTicket && (
                <TicketModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleModalSubmit}
                    initialData={selectedTicket}
                    isReadOnly={false}
                    allUsers={allUsers}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
