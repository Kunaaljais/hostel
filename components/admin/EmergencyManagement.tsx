
import React from 'react';
import { EmergencyAlert, AlertStatus } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

const EmergencyManagement: React.FC<{ alerts: EmergencyAlert[], refreshData: () => void }> = ({ alerts, refreshData }) => {
    
    const handleAcknowledge = async (id: string) => {
        await api.acknowledgeEmergencyAlert(id);
        refreshData();
    };

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Emergency Alerts</h3>
            <div className="space-y-4">
                {alerts && alerts.length > 0 ? alerts.map(alert => (
                    <div 
                        key={alert.id} 
                        className={`p-4 rounded-md border-l-4 ${
                            alert.status === AlertStatus.SENT ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-slate-500">{new Date(alert.timestamp).toLocaleString()}</p>
                                <p><strong className="text-slate-600">Student:</strong> {alert.studentName} ({alert.rollNumber})</p>
                                <p><strong className="text-slate-600">Room:</strong> {alert.roomDetails}</p>
                                <p><strong className="text-slate-600">Type:</strong> <span className="font-semibold text-red-500">{alert.emergencyType}</span></p>
                                <p className="mt-2 text-slate-800">{alert.description}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${alert.status === AlertStatus.SENT ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {alert.status}
                                </p>
                                {alert.status === AlertStatus.SENT && (
                                    <Button onClick={() => handleAcknowledge(alert.id)} className="mt-4" variant="secondary">
                                        Acknowledge
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : <p className="text-slate-500">No emergency alerts.</p>}
            </div>
        </Card>
    );
};

export default EmergencyManagement;