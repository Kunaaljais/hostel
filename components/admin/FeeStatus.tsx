
import React from 'react';
import { User } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

const FeeStatus: React.FC<{ students: User[], refreshData: () => void }> = ({ students, refreshData }) => {
    const handleFeeUpdate = async (studentId: string) => {
        // This is a mock function. In a real system, this would be automated.
        await api.manuallyUpdateFeeStatus(studentId);
        refreshData();
    }
    
    return(
    <Card>
        <h3 className="text-xl font-bold mb-4">Student Fee Status</h3>
        <ul className="space-y-2">
            {students.map(s => (
                <li key={s.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-md">
                    <span>{s.name} ({s.rollNumber})</span>
                    <span className={s.feePaid ? 'text-green-500' : 'text-red-500'}>{s.feePaid ? 'Paid' : 'Pending'}</span>
                    {!s.feePaid && <Button onClick={() => handleFeeUpdate(s.id)} variant="secondary">Mark as Paid</Button>}
                </li>
            ))}
        </ul>
    </Card>
)};

export default FeeStatus;