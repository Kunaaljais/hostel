
import React, { useState } from 'react';
import { User, Complaint } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';

const ComplaintView: React.FC<{ user: User; complaints: Complaint[]; refreshData: () => void }> = ({ user, complaints, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!description) {
            alert("Please describe your complaint");
            return;
        }
        await api.fileComplaint(user.id, description);
        refreshData();
        setIsModalOpen(false);
        setDescription('');
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Complaint Box</h3>
                <Button onClick={() => setIsModalOpen(true)}>File New Complaint</Button>
            </div>
            <div className="space-y-4">
                {complaints && complaints.length > 0 ? complaints.map(c => (
                    <div key={c.id} className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                        <p><strong>Complaint:</strong> {c.description}</p>
                        <p><strong>Status:</strong> {c.status}</p>
                    </div>
                )) : <p>No complaints filed.</p>}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="File a Complaint">
                <div className="space-y-4">
                    <Textarea placeholder="Describe your complaint in detail" value={description} onChange={e => setDescription(e.target.value)} rows={5}/>
                    <Button onClick={handleSubmit} className="w-full">Submit Complaint</Button>
                </div>
            </Modal>
        </Card>
    );
};

export default ComplaintView;