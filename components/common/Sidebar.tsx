
import React, { useState } from 'react';
import { User } from '../../types';
import { LogOutIcon } from '../Icons';

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Sidebar: React.FC<{
    navItems: { id: string, label: string, icon: React.FC<React.SVGProps<SVGSVGElement>> }[];
    activeView: string;
    setActiveView: (view: string) => void;
    onLogout: () => void;
    user: User;
}> = ({ navItems, activeView, setActiveView, onLogout, user }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleNavClick = (id: string) => {
        setActiveView(id);
        setSidebarOpen(false);
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors print:hidden"
                aria-label="Toggle menu"
            >
                {sidebarOpen ? (
                    <CloseIcon className="h-6 w-6" />
                ) : (
                    <MenuIcon className="h-6 w-6" />
                )}
            </button>

            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-30 print:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside className={`
                fixed lg:static inset-y-0 left-0 w-64 bg-white flex flex-col justify-between border-r border-gray-200 print:hidden transition-transform duration-300 ease-in-out z-40
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div>
                    <div className="mb-8 p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-slate-900">IIITDM-HMS</h1>
                        <p className="text-sm text-slate-500">Hostel Portal</p>
                    </div>
                    <nav className="px-6">
                        <ul>
                            {navItems.map(item => (
                                <li key={item.id} className="mb-2">
                                    <button
                                        onClick={() => handleNavClick(item.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors font-medium ${
                                            activeView === item.id
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-slate-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5 flex-shrink-0" />
                                        <span className="text-sm">{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="p-6 border-t border-gray-200 space-y-4">
                    <div>
                        <p className="font-semibold text-slate-900 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                        <LogOutIcon className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
