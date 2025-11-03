
import React from 'react';
import { LeaveRequest, RequestStatus } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

const LeaveManagement: React.FC<{ requests: LeaveRequest[], refreshData: () => void }> = ({ requests, refreshData }) => {
    const handleApproval = async (id: string, approve: boolean) => {
        await api.approveLeave(id, approve);
        refreshData();
    };
    
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Leave Requests</h3>
            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req.id} className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                        <p><strong>Student:</strong> {req.studentName} ({req.rollNumber})</p>
                        <p><strong>Reason:</strong> {req.reason}</p>
                        <p><strong>Status:</strong> {req.status}</p>
                        {req.status === RequestStatus.PENDING && (
                            <div className="mt-2 space-x-2">
                                <Button onClick={() => handleApproval(req.id, true)}>Approve</Button>
                                <Button onClick={() => handleApproval(req.id, false)} variant="danger">Reject</Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default LeaveManagement;