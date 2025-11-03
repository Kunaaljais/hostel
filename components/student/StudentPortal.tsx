import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../types';
import * as api from '../../services/api';
import { HomeIcon, UserIcon, QrCodeIcon, FileTextIcon, MessageSquareIcon, CreditCardIcon, UtensilsIcon, PackageIcon, AlertTriangleIcon, SearchIcon } from '../Icons';
import Sidebar from '../common/Sidebar';
import StudentDashboard from './StudentDashboard';
import StudentProfile from './StudentProfile';
import GatePassView from './GatePassView';
import LeaveRequestView from './LeaveRequestView';
import ComplaintView from './ComplaintView';
import FeePaymentView from './FeePaymentView';
import MessMenuView from './MessMenuView';
import ParcelView from './ParcelView';
import EmergencyView from './EmergencyView';
import LostAndFoundView from './LostAndFoundView';

const StudentPortal: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [studentData, setStudentData] = useState<any | null>(null);

    const fetchData = useCallback(async () => {
        const data = await api.getStudentData(user.id);
        setStudentData(data);
    }, [user.id]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderView = () => {
        switch (activeView) {
            case 'profile': return <StudentProfile user={studentData?.user} room={studentData?.room} />;
            case 'gatepass': return <GatePassView user={studentData?.user} gatePass={studentData?.gatePass} room={studentData?.room} refreshData={fetchData} />;
            case 'leave': return <LeaveRequestView user={user} leaves={studentData?.leaves} refreshData={fetchData} />;
            case 'complaint': return <ComplaintView user={user} complaints={studentData?.complaints} refreshData={fetchData} />;
            case 'payment': return <FeePaymentView user={user} />;
            case 'mess': return <MessMenuView menu={studentData?.messMenu} />;
            case 'parcel': return <ParcelView user={user} parcels={studentData?.parcels} refreshData={fetchData}/>;
            case 'emergency': return <EmergencyView user={user} alerts={studentData?.emergencyAlerts} refreshData={fetchData} />;
            case 'lost-found': return <LostAndFoundView user={user} items={studentData?.lostAndFoundItems} refreshData={fetchData} />;
            default: return <StudentDashboard user={user} />;
        }
    };
    
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'profile', label: 'Profile & Room', icon: UserIcon },
        { id: 'gatepass', label: 'Gate Pass', icon: QrCodeIcon },
        { id: 'leave', label: 'Leave Request', icon: FileTextIcon },
        { id: 'complaint', label: 'Complaints', icon: MessageSquareIcon },
        { id: 'lost-found', label: 'Lost & Found', icon: SearchIcon },
        { id: 'payment', label: 'Fee Payment', icon: CreditCardIcon },
        { id: 'mess', label: 'Mess Menu', icon: UtensilsIcon },
        { id: 'parcel', label: 'Parcel Info', icon: PackageIcon },
        { id: 'emergency', label: 'Emergency', icon: AlertTriangleIcon },
    ];

    return (
        <>
            <Sidebar navItems={navItems} activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} user={user} />
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto print:overflow-visible print:p-0">
                <h1 className="text-3xl font-bold mb-6 capitalize print:hidden">{activeView.replace('-', ' ')}</h1>
                {studentData ? renderView() : <div className="print:hidden">Loading...</div>}
            </main>
        </>
    );
};

export default StudentPortal;