
import React from 'react';
import { User } from '../../types';
import { LogOutIcon } from '../Icons';

const Sidebar: React.FC<{
    navItems: { id: string, label: string, icon: React.FC<React.SVGProps<SVGSVGElement>> }[];
    activeView: string;
    setActiveView: (view: string) => void;
    onLogout: () => void;
    user: User;
}> = ({ navItems, activeView, setActiveView, onLogout, user }) => (
    <aside className="w-64 bg-white p-6 flex flex-col justify-between border-r border-gray-200 print:hidden">
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">IIITDM-HMS</h1>
                <p className="text-sm text-slate-500">Hostel Portal</p>
            </div>
            <nav>
                <ul>
                    {navItems.map(item => (
                        <li key={item.id} className="mb-2">
                            <button
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center space-x-3 p-3 rounded-md transition-colors ${
                                    activeView === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 text-slate-600'
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
        <div>
            <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 p-3 mt-4 rounded-md hover:bg-gray-100 text-slate-600 transition-colors"
            >
                <LogOutIcon className="h-5 w-5" />
                <span>Logout</span>
            </button>
        </div>
    </aside>
);

export default Sidebar;
