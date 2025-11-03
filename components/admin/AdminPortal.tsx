
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../types';
import * as api from '../../services/api';
import { BarChartIcon, QrCodeIcon, FileTextIcon, MessageSquareIcon, BedDoubleIcon, CreditCardIcon, UtensilsIcon, PackageIcon, AlertTriangleIcon, SearchIcon } from '../Icons';
import Sidebar from '../common/Sidebar';
import AdminDashboard from './AdminDashboard';
import GatePassManagement from './GatePassManagement';
import LeaveManagement from './LeaveManagement';
import ComplaintManagement from './ComplaintManagement';
import RoomAllocation from './RoomAllocation';
import FeeStatus from './FeeStatus';
import MessMenuEditor from './MessMenuEditor';
import ParcelManagement from './ParcelManagement';
import EmergencyManagement from './EmergencyManagement';
import LostAndFoundManagement from './LostAndFoundManagement';

const AdminPortal: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [adminData, setAdminData] = useState<any | null>(null);

    const fetchData = useCallback(async () => {
        const data = await api.getAdminData();
        setAdminData(data);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderView = () => {
        if (!adminData) return <div>Loading...</div>
        switch (activeView) {
            case 'gatepass': return <GatePassManagement requests={adminData.gatePassRequests} refreshData={fetchData} />;
            case 'leave': return <LeaveManagement requests={adminData.leaveRequests} refreshData={fetchData} />;
            case 'complaints': return <ComplaintManagement requests={adminData.complaints} refreshData={fetchData} />;
            case 'rooms': return <RoomAllocation rooms={adminData.rooms} students={adminData.students} refreshData={fetchData} />;
            case 'fees': return <FeeStatus students={adminData.students} refreshData={fetchData} />;
            case 'mess': return <MessMenuEditor menu={adminData.messMenu} refreshData={fetchData} />;
            case 'parcels': return <ParcelManagement parcels={adminData.parcels} students={adminData.students} refreshData={fetchData} />;
            case 'emergency': return <EmergencyManagement alerts={adminData.emergencyAlerts} refreshData={fetchData} />;
            case 'lost-found': return <LostAndFoundManagement items={adminData.lostAndFoundItems} refreshData={fetchData} />;
            default: return <AdminDashboard analytics={adminData.analytics} />;
        }
    };
    
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChartIcon },
        { id: 'gatepass', label: 'Gate Pass', icon: QrCodeIcon },
        { id: 'leave', label: 'Leave Requests', icon: FileTextIcon },
        { id: 'complaints', label: 'Complaints', icon: MessageSquareIcon },
        { id: 'rooms', label: 'Room Allocation', icon: BedDoubleIcon },
        { id: 'fees', label: 'Fee Status', icon: CreditCardIcon },
        { id: 'mess', label: 'Mess Menu', icon: UtensilsIcon },
        { id: 'parcels', label: 'Parcels', icon: PackageIcon },
        { id: 'emergency', label: 'Emergency Alerts', icon: AlertTriangleIcon },
        { id: 'lost-found', label: 'Lost & Found', icon: SearchIcon },
    ]

    return (
        <>
            <Sidebar navItems={navItems} activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} user={user} />
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-6 capitalize">{activeView.replace('-', ' ')}</h1>
                {renderView()}
            </main>
        </>
    );
};

export default AdminPortal;