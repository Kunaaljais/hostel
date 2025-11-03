
import React from 'react';
import { User, Room } from '../../types';
import Card from '../ui/Card';

const StudentProfile: React.FC<{ user: User | undefined; room: Room | undefined }> = ({ user, room }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <h3 className="text-xl font-bold mb-4">Personal Details</h3>
            {user ? (
                <div className="space-y-2 text-slate-700">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Roll Number:</strong> {user.rollNumber}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Contact Number:</strong> {user.contactNumber || 'N/A'}</p>
                    <p><strong>Fee Status:</strong> <span className={user.feePaid ? 'text-green-500' : 'text-red-500'}>{user.feePaid ? 'Paid' : 'Pending'}</span></p>
                </div>
            ) : <p>Loading...</p>}
        </Card>
        <Card>
            <h3 className="text-xl font-bold mb-4">Room Details</h3>
            {room ? (
                <div className="space-y-2 text-slate-700">
                    <p><strong>Block:</strong> {room.block}</p>
                    <p><strong>Room Number:</strong> {room.roomNumber}</p>
                </div>
            ) : <p className="text-slate-500">Room not allocated yet. Please pay your fees.</p>}
        </Card>
        <Card>
            <h3 className="text-xl font-bold mb-4">Guardian Information</h3>
            {user && user.guardian ? (
                <div className="space-y-2 text-slate-700">
                    <p><strong>Name:</strong> {user.guardian.name}</p>
                    <p><strong>Contact Number:</strong> {user.guardian.contactNumber}</p>
                </div>
            ) : <p className="text-slate-500">Guardian information not available.</p>}
        </Card>
    </div>
);

export default StudentProfile;