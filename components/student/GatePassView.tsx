import React, { useState } from 'react';
import { User, GatePass, GatePassStatus, Room } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import PrintableGatePass from './PrintableGatePass';

const GatePassView: React.FC<{ user: User | undefined; gatePass: GatePass | null; room: Room | undefined; refreshData: () => void }> = ({ user, gatePass, room, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleSubmit = async () => {
        if (!user) return;
        if (!reason || !fromDate || !toDate) {
            alert("Please fill all fields");
            return;
        }
        await api.applyForGatePass(user.id, { reason, fromDate, toDate });
        refreshData();
        setIsModalOpen(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const StatusBadge: React.FC<{ status: GatePassStatus }> = ({ status }) => {
        const styles = {
            [GatePassStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
            [GatePassStatus.APPROVED]: 'bg-green-100 text-green-800',
            [GatePassStatus.OUT]: 'bg-blue-100 text-blue-800',
            [GatePassStatus.IN]: 'bg-gray-100 text-gray-800',
            [GatePassStatus.REJECTED]: 'bg-red-100 text-red-800'
        };
        return <span className={`px-2 py-1 rounded-full text-sm font-medium ${styles[status]}`}>{status}</span>;
    };

    const renderContent = () => {
        if (!gatePass) {
            return <p className="text-slate-500">You have no active gate pass requests. Click the button to apply.</p>;
        }

        if (gatePass.status === GatePassStatus.PENDING) {
            return (
                <div className="text-center">
                    <h4 className="text-lg font-semibold">Request Submitted</h4>
                    <p className="text-slate-600 my-4">Please show this QR code to the hostel warden or admin for approval.</p>
                    <div className="mt-4 p-4 bg-white rounded-lg inline-block border">
                        <QRCode value={gatePass.approvalQrCodeData} size={200} />
                    </div>
                </div>
            );
        }

        return (
             <div className="space-y-4">
                <p><strong>Status:</strong> <StatusBadge status={gatePass.status} /></p>
                <p><strong>Reason:</strong> {gatePass.reason}</p>
                <p><strong>From:</strong> {new Date(gatePass.fromDate).toLocaleString()}</p>
                <p><strong>To:</strong> {new Date(gatePass.toDate).toLocaleString()}</p>
            </div>
        )
    }

    return (
        <>
            <div className="print:hidden">
                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">Your Gate Pass Status</h3>
                        <div className="flex flex-col items-end space-y-2">
                             {gatePass && [GatePassStatus.APPROVED, GatePassStatus.OUT].includes(gatePass.status) && (
                                <Button onClick={handlePrint}>Print Gate Pass</Button>
                            )}
                            {!gatePass || [GatePassStatus.IN, GatePassStatus.REJECTED].includes(gatePass.status) ? (
                                <Button onClick={() => setIsModalOpen(true)}>Apply for Gate Pass</Button>
                            ) : null}
                        </div>
                    </div>
                    
                    {renderContent()}

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Gate Pass">
                        <div className="space-y-4">
                            <Textarea placeholder="Reason for leave" value={reason} onChange={e => setReason(e.target.value)} rows={3}/>
                            <Input type="datetime-local" placeholder="From Date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                            <Input type="datetime-local" placeholder="To Date" value={toDate} onChange={e => setToDate(e.target.value)} />
                            <Button onClick={handleSubmit} className="w-full">Submit Application</Button>
                        </div>
                    </Modal>
                </Card>
            </div>
            <div className="hidden print:block">
                {gatePass && user && gatePass.qrCodeData && <PrintableGatePass pass={gatePass} user={user} room={room} />}
            </div>
        </>
    );
};

export default GatePassView;