
import React from 'react';
import { User } from '../../types';
import Card from '../ui/Card';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const FeePaymentView: React.FC<{ user: User }> = ({ user }) => (
    <Card>
        <h3 className="text-xl font-bold mb-4">Hostel Fee Payment</h3>
        {user.feePaid ? (
            <p className="text-green-500">Your fees are paid. Thank you!</p>
        ) : (
            <div className="flex flex-col items-center">
                <p className="mb-4 text-slate-700">Please scan the QR code below using any UPI app to pay your hostel fees.</p>
                <div className="bg-white p-4 rounded-lg border">
                    <QRCode value="https://www.eduqfix.com/PayDirect/#/student" size={256} />
                </div>
                <p className="mt-4 text-sm text-slate-500">After payment, it may take some time for the status to update.</p>
            </div>
        )}
    </Card>
);

export default FeePaymentView;