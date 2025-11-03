
import React from 'react';
import { MessMenuItem } from '../../types';
import Card from '../ui/Card';

const MessMenuView: React.FC<{ menu: MessMenuItem[] }> = ({ menu }) => (
    <Card>
        <h3 className="text-xl font-bold mb-4">Weekly Mess Menu</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-3">Day</th>
                        <th className="p-3">Breakfast</th>
                        <th className="p-3">Lunch</th>
                        <th className="p-3">Dinner</th>
                    </tr>
                </thead>
                <tbody>
                    {menu && menu.map(item => (
                        <tr key={item.day} className="border-b border-gray-200">
                            <td className="p-3 font-semibold">{item.day}</td>
                            <td className="p-3">{item.breakfast}</td>
                            <td className="p-3">{item.lunch}</td>
                            <td className="p-3">{item.dinner}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

export default MessMenuView;