
import React from 'react';
import { AdminDashboardAnalytics } from '../../types';
import Card from '../ui/Card';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangleIcon } from '../Icons';

const AdminDashboard: React.FC<{ analytics: AdminDashboardAnalytics | undefined }> = ({ analytics }) => {
    if (!analytics) return <Card>Loading analytics...</Card>;
    
    const feePieData = [
        { name: 'Fees Paid', value: analytics.feesPaid },
        { name: 'Fees Pending', value: analytics.feesPending },
    ];
    const COLORS = ['#4ade80', '#f87171'];

    const summaryData = [
        { name: 'Total Students', value: analytics.totalStudents },
        { name: 'On Leave', value: analytics.studentsOnLeave },
        { name: 'Outside', value: analytics.studentsOut },
        { name: 'Pending Complaints', value: analytics.pendingComplaints },
        { name: 'Parcels to Collect', value: analytics.parcelsToCollect },
        { name: 'Fees Pending', value: analytics.feesPending },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.pendingEmergencies > 0 && (
                 <Card className="md:col-span-2 lg:col-span-3 bg-red-600 text-white border-2 border-red-500 animate-pulse">
                    <div className="flex items-center space-x-4">
                        <AlertTriangleIcon className="h-12 w-12 text-yellow-300" />
                        <div>
                            <p className="text-yellow-300 text-xl font-bold">PENDING EMERGENCY</p>
                            <p className="text-5xl font-bold">{analytics.pendingEmergencies}</p>
                        </div>
                    </div>
                </Card>
            )}

            {summaryData.map(item => (
                <Card key={item.name}>
                    <p className="text-slate-500">{item.name}</p>
                    <p className="text-4xl font-bold">{item.value}</p>
                </Card>
            ))}

            <Card className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Leave Requests Trend (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.leaveRequestsOverTime.slice(-7)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} />
                        <Legend />
                        <Line type="monotone" dataKey="count" name="Daily Requests" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
            
            <Card>
                <h3 className="text-xl font-bold mb-4">Fee Payment Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={feePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {feePieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default AdminDashboard;