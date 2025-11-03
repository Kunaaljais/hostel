
import React, { useState } from 'react';
import { Parcel, User } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

const ParcelManagement: React.FC<{ parcels: Parcel[], students: User[], refreshData: () => void }> = ({ parcels, students, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [courier, setCourier] = useState('');
    const [trackingId, setTrackingId] = useState('');

    const handleSubmit = async () => {
        if (!studentId || !courier) {
            alert('Please select a student and enter courier name.');
            return;
        }
        await api.addParcel({ studentId, courier, trackingId });
        refreshData();
        setIsModalOpen(false);
    };
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Parcel Management</h3>
                <Button onClick={() => setIsModalOpen(true)}>Add New Parcel</Button>
            </div>
            <div className="space-y-2">
                {parcels.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-md">
                        <span>{p.studentName} ({p.rollNumber}) - {p.courier}</span>
                        <span className={p.collected ? 'text-green-500' : 'text-yellow-500'}>{p.collected ? 'Collected' : 'Pending'}</span>
                    </div>
                ))}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Parcel">
                <div className="space-y-4">
                    <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900">
                        <option value="">Select Student</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>)}
                    </select>
                    <Input placeholder="Courier Name" value={courier} onChange={e => setCourier(e.target.value)} />
                    <Input placeholder="Tracking ID (Optional)" value={trackingId} onChange={e => setTrackingId(e.target.value)} />
                    <Button onClick={handleSubmit} className="w-full">Add Parcel</Button>
                </div>
            </Modal>
        </Card>
    )
};

export default ParcelManagement;