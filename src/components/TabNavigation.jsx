import React from 'react'

const TabNavigation = ({ activeTab, handleTabChange }) => {
    
    return (
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => handleTabChange('upcoming')}
                >
                    Upcoming
                </button>
            </li>
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === 'managing' ? 'active' : ''}`}
                    onClick={() => handleTabChange('managing')}
                >
                    Managing
                </button>
            </li>
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === 'attending' ? 'active' : ''}`}
                    onClick={() => handleTabChange('attending')}
                >
                    Attending
                </button>
            </li>
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => handleTabChange('create')}
                >
                    Create Event
                </button>
            </li>
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => handleTabChange('profile')}
                >
                    My Profile
                </button>
            </li>
        </ul>
    )
}

export default TabNavigation