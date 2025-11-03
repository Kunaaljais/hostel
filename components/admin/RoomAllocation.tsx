
import React, { useState, useMemo } from 'react';
import { Room, User } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

const RoomAllocation: React.FC<{ rooms: Room[], students: User[], refreshData: () => void }> = ({ rooms, students, refreshData }) => {
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');

    const unallocatedStudents = useMemo(() => students.filter(s => !s.room && s.feePaid), [students]);

    const handleAllocate = async () => {
        if (!selectedStudent || !selectedRoom) {
            alert("Please select a student and a room.");
            return;
        }
        await api.allocateRoom(selectedStudent, selectedRoom);
        refreshData();
        setSelectedStudent('');
        setSelectedRoom('');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h3 className="text-xl font-bold mb-4">Allocate Room</h3>
                <div className="space-y-4">
                    <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900">
                        <option value="">Select Student (Fee Paid)</option>
                        {unallocatedStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>)}
                    </select>
                    <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-slate-900">
                        <option value="">Select Room (with space)</option>
                        {rooms.filter(r => r.occupants.length < r.capacity).map(r => <option key={r.id} value={r.id}>{r.block} - {r.roomNumber}</option>)}
                    </select>
                    <Button onClick={handleAllocate} className="w-full">Allocate</Button>
                </div>
            </Card>
            <Card>
                 <h3 className="text-xl font-bold mb-4">Room Occupancy</h3>
                 <div className="space-y-2">
                    {rooms.map(room => (
                        <div key={room.id} className="text-sm">
                            <p><strong>{room.block}-{room.roomNumber}</strong>: {room.occupants.length}/{room.capacity}</p>
                        </div>
                    ))}
                 </div>
            </Card>
        </div>
    )
};

export default RoomAllocation;