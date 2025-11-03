
import React from 'react';
import { User, Parcel } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ParcelView: React.FC<{ user: User, parcels: Parcel[], refreshData: () => void }> = ({ user, parcels, refreshData }) => {
    const handleCollect = async (parcelId: string) => {
        await api.collectParcel(parcelId);
        refreshData();
    }
    
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Your Parcels</h3>
            <div className="space-y-4">
                {parcels && parcels.length > 0 ? parcels.map(p => (
                    <div key={p.id} className={`p-4 rounded-md flex justify-between items-center ${p.collected ? 'bg-gray-100' : 'bg-indigo-50'}`}>
                        <div>
                            <p><strong>Courier:</strong> {p.courier}</p>
                            <p><strong>Tracking ID:</strong> {p.trackingId}</p>
                            <p><strong>Received On:</strong> {new Date(p.receivedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            {p.collected ? (
                                <span className="text-green-500 font-semibold">Collected</span>
                            ) : (
                                <Button onClick={() => handleCollect(p.id)} variant="secondary">Mark as Collected</Button>
                            )}
                        </div>
                    </div>
                )) : <p>You have no parcels waiting for collection.</p>}
            </div>
        </Card>
    );
};

export default ParcelView;