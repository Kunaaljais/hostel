
import React, { useState } from 'react';
import { GatePass } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import QRCodeScanner from '../QRCodeScanner';

const GatePassManagement: React.FC<{ requests: GatePass[], refreshData: () => void }> = ({ requests, refreshData }) => {
    const [isScanning, setIsScanning] = useState(false);

    const handleApproval = async (id: string, approve: boolean) => {
        await api.approveGatePass(id, approve);
        refreshData();
    };
    
    const handleScan = async (data: string) => {
        setIsScanning(false);
        try {
            // Data from the approval QR code is the passId.
            // We approve it directly.
            const result = await api.approveGatePass(data, true);
            alert(`Success! Gate pass for ${result.studentName} has been approved.`);
            refreshData();
        } catch (error) {
            alert((error as Error).message);
        }
    };
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Gate Pass Requests</h3>
                <Button onClick={() => setIsScanning(true)}>Scan QR to Approve/Update</Button>
            </div>
            {isScanning && <QRCodeScanner onScan={handleScan} onClose={() => setIsScanning(false)} />}
            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req.id} className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                        <p><strong>Student:</strong> {req.studentName} ({req.rollNumber})</p>
                        <p><strong>Reason:</strong> {req.reason}</p>
                        <p><strong>Status:</strong> {req.status}</p>
                        {req.status === 'pending' && (
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

export default GatePassManagement;