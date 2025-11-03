
import React, { useState } from 'react';
import { MessMenuItem } from '../../types';
import * as api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const MessMenuEditor: React.FC<{ menu: MessMenuItem[], refreshData: () => void }> = ({ menu, refreshData }) => {
    const [editableMenu, setEditableMenu] = useState(menu);
    
    const handleMenuChange = (day: string, field: string, value: string) => {
        setEditableMenu(prev => prev.map(item => item.day === day ? {...item, [field]: value} : item));
    }
    
    const handleSave = async () => {
        await api.updateMessMenu(editableMenu);
        refreshData();
        alert("Mess menu updated!");
    };
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Edit Mess Menu</h3>
                <Button onClick={handleSave}>Save Changes</Button>
            </div>
            {editableMenu.map(item => (
                <div key={item.day} className="grid grid-cols-4 gap-4 items-center mb-2">
                    <strong className="text-slate-800">{item.day}</strong>
                    <Input value={item.breakfast} onChange={e => handleMenuChange(item.day, 'breakfast', e.target.value)} />
                    <Input value={item.lunch} onChange={e => handleMenuChange(item.day, 'lunch', e.target.value)} />
                    <Input value={item.dinner} onChange={e => handleMenuChange(item.day, 'dinner', e.target.value)} />
                </div>
            ))}
        </Card>
    )
};

export default MessMenuEditor;