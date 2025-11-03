
import React, { useState } from 'react';
import { User, LeaveRequest } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';

const LeaveRequestView: React.FC<{ user: User; leaves: LeaveRequest[]; refreshData: () => void }> = ({ user, leaves, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');

    const handleSubmit = async () => {
        if (!reason) {
            alert("Please provide a reason");
            return;
        }
        await api.applyForLeave(user.id, reason);
        refreshData();
        setIsModalOpen(false);
        setReason('');
    };
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Leave Requests</h3>
                <Button onClick={() => setIsModalOpen(true)}>New Leave Request</Button>
            </div>
            <div className="space-y-4">
                {leaves && leaves.length > 0 ? leaves.map(leave => (
                    <div key={leave.id} className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                        <p><strong>Reason:</strong> {leave.reason}</p>
                        <p><strong>Status:</strong> {leave.status}</p>
                    </div>
                )) : <p>No leave requests found.</p>}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Leave Request">
                <div className="space-y-4">
                    <Textarea placeholder="Reason for leave" value={reason} onChange={e => setReason(e.target.value)} rows={5}/>
                    <Button onClick={handleSubmit} className="w-full">Submit</Button>
                </div>
            </Modal>
        </Card>
    );
};

export default LeaveRequestView;