import React from 'react';
import { GatePass, User, Room } from '../../types';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { UserIcon } from '../Icons';

const PrintableGatePass: React.FC<{ pass: GatePass; user: User; room: Room | undefined }> = ({ pass, user, room }) => {
    return (
        <div className="p-8 bg-white text-black font-sans">
            <header className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-3xl font-bold">Indian Institute of Information Technology, Design and Manufacturing, Kurnool</h1>
                <h2 className="text-2xl font-semibold mt-2">Hostel Gate Pass</h2>
            </header>
            
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                    <div className="flex items-baseline">
                        <p className="w-1/3 font-semibold">Name:</p>
                        <p className="w-2/3 border-b border-dotted border-black">{user.name}</p>
                    </div>
                    <div className="flex items-baseline">
                        <p className="w-1/3 font-semibold">Roll Number:</p>
                        <p className="w-2/3 border-b border-dotted border-black">{user.rollNumber}</p>
                    </div>
                    <div className="flex items-baseline">
                        <p className="w-1/3 font-semibold">Room No:</p>
                        <p className="w-2/3 border-b border-dotted border-black">{room ? `${room.block}-${room.roomNumber}` : 'N/A'}</p>
                    </div>
                     <div className="flex items-baseline">
                        <p className="w-1/3 font-semibold">Valid From:</p>
                        <p className="w-2/3 border-b border-dotted border-black">{new Date(pass.fromDate).toLocaleString()}</p>
                    </div>
                     <div className="flex items-baseline">
                        <p className="w-1/3 font-semibold">Valid To:</p>
                        <p className="w-2/3 border-b border-dotted border-black">{new Date(pass.toDate).toLocaleString()}</p>
                    </div>
                    <div className="flex">
                        <p className="w-1/3 font-semibold">Reason:</p>
                        <p className="w-2/3 h-12 border-b border-dotted border-black pt-1">{pass.reason}</p>
                    </div>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-start space-y-4">
                     <div className="w-32 h-40 border-2 border-black flex items-center justify-center relative bg-gray-100">
                        <UserIcon className="w-24 h-24 text-gray-400" />
                        <p className="absolute bottom-1 text-xs text-gray-600">Student Photo</p>
                    </div>
                    {pass.qrCodeData && (
                        <div className="p-2 bg-white border border-black">
                            <QRCode value={pass.qrCodeData} size={160} />
                        </div>
                    )}
                </div>
            </div>

            <footer className="mt-16 flex justify-between items-end">
                <div className="text-center">
                     <p className="mt-2 border-t-2 border-dotted border-black pt-1 px-8">Student's Signature</p>
                </div>
                 <div className="text-center">
                    <p className="mt-2 border-t-2 border-dotted border-black pt-1 px-8">Warden's Signature</p>
                </div>
            </footer>
            
            <div className="mt-8 text-xs text-gray-600">
                <p><strong>Instructions:</strong></p>
                <ol className="list-decimal list-inside">
                    <li>This pass is non-transferable.</li>
                    <li>Students must return to the hostel within the specified time.</li>
                    <li>This pass must be shown at the gate during entry and exit.</li>
                </ol>
            </div>
        </div>
    );
};

export default PrintableGatePass;