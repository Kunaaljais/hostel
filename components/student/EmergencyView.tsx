
import React, { useState } from 'react';
import { User, EmergencyAlert, EmergencyType, AlertStatus } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';
import { AlertTriangleIcon } from '../Icons';

const EmergencyView: React.FC<{ user: User; alerts: EmergencyAlert[]; refreshData: () => void }> = ({ user, alerts, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emergencyType, setEmergencyType] = useState<EmergencyType>(EmergencyType.MEDICAL);
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!description) {
            alert("Please provide a brief description of the emergency.");
            return;
        }
        await api.sendEmergencyAlert(user.id, { emergencyType, description });
        refreshData();
        setIsModalOpen(false);
        setDescription('');
    };

    const StatusBadge: React.FC<{ status: AlertStatus }> = ({ status }) => {
        const styles = {
            [AlertStatus.SENT]: 'bg-yellow-100 text-yellow-800',
            [AlertStatus.ACKNOWLEDGED]: 'bg-green-100 text-green-800',
        };
        return <span className={`px-2 py-1 rounded-full text-sm font-medium ${styles[status]}`}>{status}</span>;
    };

    return (
        <Card>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold">Emergency Alert System</h3>
                    <p className="text-slate-500 mt-1">For urgent situations only. Misuse will result in disciplinary action.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} variant="danger" className="mt-4 md:mt-0 flex items-center space-x-2">
                    <AlertTriangleIcon className="h-5 w-5" />
                    <span>Send New Alert</span>
                </Button>
            </div>

            <h4 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">Your Alert History</h4>
            <div className="space-y-4">
                {alerts && alerts.length > 0 ? alerts.map(alert => (
                    <div key={alert.id} className="bg-gray-100 p-4 rounded-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-lg">{alert.emergencyType}</p>
                                <p className="text-slate-700">{alert.description}</p>
                            </div>
                            <StatusBadge status={alert.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                )) : <p className="text-slate-500">No emergency alerts sent.</p>}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send Emergency Alert">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type of Emergency</label>
                        <select
                            value={emergencyType}
                            onChange={e => setEmergencyType(e.target.value as EmergencyType)}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900"
                        >
                            {Object.values(EmergencyType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <Textarea 
                            placeholder="Briefly describe the situation..." 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            rows={4}
                        />
                    </div>
                    <Button onClick={handleSubmit} className="w-full" variant="danger">Submit Alert</Button>
                </div>
            </Modal>
        </Card>
    );
};

export default EmergencyView;