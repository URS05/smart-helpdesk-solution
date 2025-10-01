import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, User, TicketStatus, AISuggestion, UserRole } from '../types';
import { getTicketSuggestions } from '../services/geminiService';
import TicketModal from '../components/TicketModal';

interface TechnicianDashboardProps {
  currentUser: User;
  tickets: Ticket[];
  handleUpdateTicket: (ticket: Ticket) => void;
  onLogout: () => void;
  allUsers: User[];
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.868 2.884c.321.64.321 1.415 0 2.055l-1.44 2.881c-.16.32-.16.69 0 1.01l1.44 2.882c.321.64.321 1.414 0 2.054l-1.084 2.168a1.5 1.5 0 01-2.592 0l-1.084-2.168c-.321-.64-.321-1.414 0-2.054l1.44-2.882c.16-.32.16-.69 0-1.01l-1.44-2.88c-.321-.64-.321-1.415 0-2.056l1.084-2.168a1.5 1.5 0 012.592 0l1.084 2.168zM8.5 4.5a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM6 6.5a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM6 12.5a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM8.5 14.5a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM11.5 4.5a.5.5 0 001 0v1a.5.5 0 00-1 0v-1zM14 6.5a.5.5 0 001 0v1a.5.5 0 00-1 0v-1zM14 12.5a.5.5 0 001 0v1a.5.5 0 00-1 0v-1zM11.5 14.5a.5.5 0 001 0v1a.5.5 0 00-1 0v-1z" clipRule="evenodd" />
  </svg>
);

const TicketListItem: React.FC<{ ticket: Ticket; selected: boolean; onSelect: (ticket: Ticket) => void; getPriorityColor: (priority: string) => string; }> = ({ ticket, selected, onSelect, getPriorityColor }) => (
    <div onClick={() => onSelect(ticket)}
      className={`p-3 rounded-md cursor-pointer transition-all duration-200 ${selected ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'bg-gray-700/50 hover:bg-gray-700'}`}>
      <div className="flex justify-between items-start">
          <p className="font-bold text-white text-sm">{ticket.title}</p>
          <span className={`px-2 py-0.5 text-xs rounded-full text-white/90 ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
      </div>
      <p className="text-xs text-industrial-secondary-text mt-1">{ticket.id} &bull; {ticket.requester.name}</p>
    </div>
);


const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ currentUser, tickets, handleUpdateTicket, onLogout, allUsers }) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const assignedTickets = tickets.filter(t => t.assignee?.id === currentUser.id && t.status !== TicketStatus.CLOSED && t.status !== TicketStatus.RESOLVED);
  const unassignedTickets = tickets.filter(t => !t.assignee && t.status !== TicketStatus.CLOSED && t.status !== TicketStatus.RESOLVED);

  useEffect(() => {
    const allVisibleTickets = [...assignedTickets, ...unassignedTickets];
    if (allVisibleTickets.length > 0 && (!selectedTicket || !allVisibleTickets.find(t => t.id === selectedTicket.id))) {
      setSelectedTicket(allVisibleTickets[0]);
    } else if (allVisibleTickets.length === 0) {
      setSelectedTicket(null);
    }
  }, [tickets, selectedTicket]);

  const handleSelectTicket = (ticket: Ticket) => {
      setSelectedTicket(ticket);
      setAiSuggestions(null); // Clear previous suggestions
  }

  const handleGetSuggestions = useCallback(async () => {
    if (!selectedTicket) return;
    setIsLoadingSuggestions(true);
    setAiSuggestions(null);
    const suggestions = await getTicketSuggestions(selectedTicket);
    setAiSuggestions(suggestions);
    setIsLoadingSuggestions(false);
  }, [selectedTicket]);
  
  const handleModalSubmit = (updatedTicketData: Ticket) => {
    handleUpdateTicket(updatedTicketData);
    if(updatedTicketData.assignee?.id === currentUser.id || !updatedTicketData.assignee) {
        setSelectedTicket(updatedTicketData); // update view immediately if still visible
    }
    setIsModalOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'Urgent') return 'bg-red-500 border-red-500';
    if (priority === 'High') return 'bg-amber-500 border-amber-500';
    if (priority === 'Medium') return 'bg-yellow-500 border-yellow-500';
    return 'bg-green-500 border-green-500';
  };

  return (
    <div className="flex h-screen bg-industrial-darker text-industrial-text font-sans">
      <aside className="w-1/3 bg-industrial-dark p-4 overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Ticket Queues</h2>
            <button onClick={onLogout} className="px-3 py-1 text-sm font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 transition">
              Logout
            </button>
        </div>

        <div>
            <h3 className="text-base font-semibold text-amber-400 mb-2 border-b border-gray-700 pb-1">Assigned to Me</h3>
            <div className="space-y-3">
                {assignedTickets.length > 0 ? assignedTickets.map(ticket => (
                    <TicketListItem key={ticket.id} ticket={ticket} selected={selectedTicket?.id === ticket.id} onSelect={handleSelectTicket} getPriorityColor={getPriorityColor} />
                )) : <p className="text-industrial-secondary-text text-sm p-2">You have no assigned tickets.</p>}
            </div>
        </div>

        <div className="mt-6">
            <h3 className="text-base font-semibold text-amber-400 mb-2 border-b border-gray-700 pb-1">Unassigned Queue</h3>
            <div className="space-y-3">
                 {unassignedTickets.length > 0 ? unassignedTickets.map(ticket => (
                    <TicketListItem key={ticket.id} ticket={ticket} selected={selectedTicket?.id === ticket.id} onSelect={handleSelectTicket} getPriorityColor={getPriorityColor} />
                )) : <p className="text-industrial-secondary-text text-sm p-2">No unassigned tickets.</p>}
            </div>
        </div>
      </aside>

      <main className="w-2/3 p-6 flex flex-col overflow-y-auto">
        {selectedTicket ? (
          <>
            <div className="flex-grow">
              <header className="pb-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">{selectedTicket.title}</h1>
                     <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">Update Ticket</button>
                </div>
                <p className="text-industrial-secondary-text mt-1">
                  Requested by <span className="text-white font-semibold">{selectedTicket.requester.name}</span> on {new Date(selectedTicket.createdAt).toLocaleString()}
                </p>
                 <div className="mt-2">Status: <span className="px-3 py-1 text-sm font-bold rounded-full bg-cyan-600 text-white">{selectedTicket.status}</span></div>
              </header>
              <div className="mt-6 prose prose-invert prose-sm max-w-none text-industrial-text">
                  <p>{selectedTicket.description}</p>
              </div>
            </div>

            <div className="flex-shrink-0 mt-6 p-4 bg-industrial-dark rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                    <button onClick={handleGetSuggestions} disabled={isLoadingSuggestions} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-gray-500 transition">
                        <SparklesIcon className="w-4 h-4" />
                        {isLoadingSuggestions ? 'Analyzing...' : 'Get Suggestions'}
                    </button>
                </div>
                {isLoadingSuggestions && <div className="text-center p-4">Loading suggestions...</div>}
                {aiSuggestions && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-bold text-amber-400 mb-2">Potential Solutions</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {aiSuggestions.solutions.map((sol, i) => <li key={i}>{sol}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-amber-400 mb-2">Knowledge Base Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {aiSuggestions.keywords.map((kw, i) => <span key={i} className="px-2 py-1 bg-gray-600/50 rounded-md text-xs">{kw}</span>)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-industrial-secondary-text">Select a ticket to view details</p>
          </div>
        )}
      </main>
      {isModalOpen && selectedTicket && (
          <TicketModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
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

export default TechnicianDashboard;