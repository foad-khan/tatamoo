import React from 'react';

interface HeaderProps {
    userInfo: { email: string; organization: string } | null;
    onStartOver: () => void;
}

const Header: React.FC<HeaderProps> = ({ userInfo, onStartOver }) => {
    return (
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-20">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Title */}
                    <button onClick={onStartOver} className="flex items-center text-slate-800 hover:text-indigo-600 transition-colors focus:outline-none" title="Start New Assessment">
                        <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            MaturityMap
                        </span>
                    </button>
                    
                    {/* User Info and Actions */}
                    {userInfo && (
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-700">{userInfo.organization}</p>
                                <p className="text-xs text-slate-500">{userInfo.email}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold ring-2 ring-white select-none">
                                {userInfo.organization.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
