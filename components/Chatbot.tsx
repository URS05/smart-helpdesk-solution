import React, { useState, useRef, useEffect } from 'react';
import { User, Ticket, TicketCategory, TicketPriority } from '../types';

const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.352 0 9.75-3.806 9.75-8.5s-4.398-8.5-9.75-8.5-9.75 3.806-9.75 8.5c0 2.421 1.152 4.614 3.004 6.166a.75.75 0 00.446.286l.995.248a.75.75 0 00.825-.375l.422-.843a6.715 6.715 0 00-1.62-1.828.75.75 0 00-.974 1.229 4.966 4.966 0 011.66 2.33zM13.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-5.25 1.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" clipRule="evenodd" />
  </svg>
);

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

interface ChatbotProps {
    currentUser: User;
    handleCreateTicket: (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'requester' | 'source' | 'comments' | 'status'>) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ handleCreateTicket }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hello! I'm the POWERGRID AI Assistant. Briefly describe your issue to create a ticket." }
    ]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;
        const userMessage = inputValue;
        const newMessages: Message[] = [...messages, { sender: 'user', text: userMessage }];
        setMessages(newMessages);
        setInputValue('');

        setTimeout(() => {
            const newTicketData = {
                title: userMessage.substring(0, 50), // Use first 50 chars as title
                description: userMessage,
                priority: TicketPriority.MEDIUM,
                category: TicketCategory.OTHER, // AI would normally classify this
            };
            handleCreateTicket(newTicketData);

            setMessages(prev => [
                ...prev, 
                { sender: 'bot', text: "I've created a ticket for you based on your description. You can see it on your dashboard. An IT technician will be in touch shortly." }
            ]);
        }, 1500);
    };

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-50">
                <ChatIcon className="w-8 h-8"/>
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50">
                    <header className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-bold text-center flex-1">AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white font-bold">&times;</button>
                    </header>
                    <div className="flex-grow p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-2 border-t dark:border-gray-700 flex">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your issue..."
                            className="w-full p-2 border rounded-l-md dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700">Send</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
