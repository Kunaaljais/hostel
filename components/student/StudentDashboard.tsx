
import React from 'react';
import { User } from '../../types';
import Card from '../ui/Card';

const StudentDashboard: React.FC<{ user: User }> = ({ user }) => (
    <Card>
        <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
        <p className="text-slate-400 mt-2">Here is a quick overview of your hostel status.</p>
    </Card>
);

export default StudentDashboard;
