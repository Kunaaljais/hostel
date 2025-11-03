
import React from 'react';
import { LostAndFoundItem, LostAndFoundStatus } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

const LostAndFoundManagement: React.FC<{ items: LostAndFoundItem[], refreshData: () => void }> = ({ items, refreshData }) => {
    
    const handleDelete = async (itemId: string) => {
        if (confirm("Are you sure you want to permanently delete this item from the board?")) {
            await api.deleteLostAndFoundItem(itemId);
            refreshData();
        }
    };
    
    const StatusBadge: React.FC<{ status: LostAndFoundStatus }> = ({ status }) => {
        const styles = {
            [LostAndFoundStatus.OPEN]: 'bg-green-100 text-green-800',
            [LostAndFoundStatus.CLAIMED]: 'bg-gray-100 text-gray-800',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
    };
    
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Manage Lost & Found Items</h3>
            <div className="space-y-4">
                {items && items.length > 0 ? items.map(item => (
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
                                <Button onClick={() => handleDelete(item.id)} variant="danger" className="mt-2 text-xs py-1 px-2">
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                )) : <p>No items on the Lost & Found board.</p>}
            </div>
        </Card>
    );
};

export default LostAndFoundManagement;
