import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority, TicketCategory, User, UserRole } from '../types';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: Ticket | null;
    isReadOnly?: boolean;
    allUsers?: User[];
    currentUser: User;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, onSubmit, initialData, isReadOnly = false, allUsers = [], currentUser }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: TicketPriority.MEDIUM,
        category: TicketCategory.OTHER,
        status: TicketStatus.OPEN,
        assigneeId: '',
        comments: [],
    });
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                priority: initialData.priority,
                category: initialData.category,
                status: initialData.status,
                assigneeId: initialData.assignee?.id || '',
                comments: initialData.comments || [],
            });
        } else {
             setFormData({
                title: '',
                description: '',
                priority: TicketPriority.MEDIUM,
                category: TicketCategory.SOFTWARE,
                status: TicketStatus.OPEN,
                assigneeId: '',
                comments: [],
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const technicians = allUsers.filter(u => u.role === UserRole.TECHNICIAN);
    const canEditAll = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.TECHNICIAN;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newComment.trim() === '') return;
        const comment = {
            author: currentUser.name,
            text: newComment,
            timestamp: new Date().toISOString(),
        };
        const updatedComments = [...formData.comments, comment];
        setFormData(prev => ({...prev, comments: updatedComments}));
        setNewComment('');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: Explicitly type finalData as Partial<Ticket>.
        // When creating a new ticket, `finalData` is based on `formData`, whose inferred type doesn't include `assignee`.
        // This typing allows the `assignee` property to be added without a TypeScript error.
        const finalData: Partial<Ticket> = initialData ? { ...initialData, ...formData } : formData;
        if(formData.assigneeId) {
            finalData.assignee = allUsers.find(u => u.id === formData.assigneeId);
        } else if (initialData) {
             delete finalData.assignee;
        }
        onSubmit(finalData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center border-b dark:border-gray-600 pb-3">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{initialData ? (isReadOnly ? 'View Ticket' : 'Update Ticket') : 'Create New Ticket'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto mt-4 pr-2">
                    {/* Main Ticket Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={isReadOnly}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} disabled={isReadOnly}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70">
                                {Object.values(TicketCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea name="description" rows={4} value={formData.description} onChange={handleChange} required disabled={isReadOnly}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70"></textarea>
                        </div>

                        {/* Editable Fields for Admin/Tech */}
                        {initialData && (
                            <>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                                <select name="priority" value={formData.priority} onChange={handleChange} disabled={!canEditAll}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70">
                                    {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} disabled={!canEditAll}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70">
                                    {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assignee</label>
                                <select name="assigneeId" value={formData.assigneeId} onChange={handleChange} disabled={!canEditAll}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70">
                                    <option value="">Unassigned</option>
                                    {technicians.map(tech => <option key={tech.id} value={tech.id}>{tech.name}</option>)}
                                </select>
                            </div>
                            </>
                        )}
                    </div>
                    
                    {/* Comments Section */}
                    {initialData && (
                        <div className="mt-6 border-t dark:border-gray-600 pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Comments</h3>
                            <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                                {formData.comments.map((comment: any, index: number) => (
                                    <div key={index} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{comment.text}</p>
                                        <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">- {comment.author} on {new Date(comment.timestamp).toLocaleDateString()}</p>
                                    </div>
                                ))}
                                {formData.comments.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet.</p>}
                            </div>
                             {canEditAll && (
                                <div className="flex gap-2">
                                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a new comment..."
                                           className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                                    <button type="button" onClick={handleCommentSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add</button>
                                </div>
                            )}
                        </div>
                    )}
                </form>

                <div className="flex justify-end gap-4 border-t dark:border-gray-600 pt-4 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                    {!isReadOnly && <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Create Ticket'}</button>}
                </div>
            </div>
        </div>
    );
};

export default TicketModal;