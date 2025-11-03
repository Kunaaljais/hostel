
import React, { useState, useMemo } from 'react';
import { User, LostAndFoundItem, LostAndFoundStatus } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';

const LostAndFoundView: React.FC<{ user: User; items: LostAndFoundItem[]; refreshData: () => void }> = ({ user, items, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemType, setItemType] = useState<'lost' | 'found'>('lost');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');

    const handleSubmit = async () => {
        if (!description || !location) {
            alert("Please fill all fields");
            return;
        }
        await api.postLostAndFoundItem(user.id, { itemType, description, location });
        refreshData();
        setIsModalOpen(false);
        setDescription('');
        setLocation('');
    };
    
    const handleClaim = async (itemId: string) => {
        if (confirm("Are you sure you want to mark this item as claimed? This action cannot be undone.")) {
            await api.claimLostAndFoundItem(itemId);
            refreshData();
        }
    }

    const filteredItems = useMemo(() => {
        if (activeTab === 'all') return items;
        return items.filter(item => item.itemType === activeTab);
    }, [items, activeTab]);
    
    const StatusBadge: React.FC<{ status: LostAndFoundStatus }> = ({ status }) => {
        const styles = {
            [LostAndFoundStatus.OPEN]: 'bg-green-100 text-green-800',
            [LostAndFoundStatus.CLAIMED]: 'bg-gray-100 text-gray-800',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Lost & Found Board</h3>
                <Button onClick={() => setIsModalOpen(true)}>Post an Item</Button>
            </div>

            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('all')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'}`}>All Items</button>
                    <button onClick={() => setActiveTab('lost')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'lost' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'}`}>Lost Items</button>
                    <button onClick={() => setActiveTab('found')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'found' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'}`}>Found Items</button>
                </nav>
            </div>

            <div className="space-y-4">
                {filteredItems.length > 0 ? filteredItems.map(item => (
                    <div key={item.id} className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`font-bold text-lg ${item.itemType === 'lost' ? 'text-red-600' : 'text-blue-600'}`}>
                                    {item.itemType === 'lost' ? 'LOST:' : 'FOUND:'} {item.description}
                                </p>
                                <p className="text-sm text-slate-600"><strong>Location:</strong> {item.location}</p>
                                <p className="text-xs text-slate-500 mt-1">Posted by {item.studentName} on {new Date(item.datePosted).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <StatusBadge status={item.status} />
                                {item.status === LostAndFoundStatus.OPEN && item.studentId !== user.id && (
                                     <Button onClick={() => handleClaim(item.id)} variant="secondary" className="mt-2 text-xs py-1 px-2">
                                        {item.itemType === 'lost' ? 'I Found This!' : 'This is Mine!'}
                                     </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : <p>No items found in this category.</p>}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post to Lost & Found">
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">I have...</label>
                        <select
                            value={itemType}
                            onChange={e => setItemType(e.target.value as 'lost' | 'found')}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900"
                        >
                            <option value="lost">Lost an item</option>
                            <option value="found">Found an item</option>
                        </select>
                    </div>
                    <Textarea placeholder="Describe the item (e.g., brand, color, any identifying marks)" value={description} onChange={e => setDescription(e.target.value)} rows={4}/>
                    <Input placeholder="Last seen / Found at (e.g., Library, Mess Hall)" value={location} onChange={e => setLocation(e.target.value)} />
                    <Button onClick={handleSubmit} className="w-full">Post Item</Button>
                </div>
            </Modal>
        </Card>
    );
};

export default LostAndFoundView;
