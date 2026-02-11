// Sidebar Component
function Sidebar({ currentPage, onNavigate }) {
    const icon = 'assets/icon.png';
    return (
        <div className="sidebar">
            <div className="logo-section">
                <img src={icon} alt="Oktrix Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', alignSelf: 'flex-start', marginTop: '4px' }} />
                <div>
                    <span className="logo-title"><span style={{ color: '#7DD3C0' }}>OK</span>TRIX</span>
                    <p className="logo-subtitle" style={{
                        fontSize: '0.65rem',
                        color: '#a8b3b0',
                        marginTop: '0px',
                        maxWidth: '160px',
                        lineHeight: '1.4'
                    }}>The Next Dimension of Human-Computer Interaction</p>
                </div>
            </div>

            <div className="nav-section-label">NAVIGATION</div>

            <nav className="nav">
                <div 
                    className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
                    onClick={() => onNavigate('dashboard')}
                >
                    <span className="nav-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
                            <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" />
                            <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" />
                            <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
                        </svg>
                    </span>
                    <span className="nav-label">Dashboard</span>
                </div>
                <div 
                    className={`nav-item ${currentPage === 'modules' ? 'active' : ''}`}
                    onClick={() => onNavigate('modules')}
                >
                    <span className="nav-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 3h2.5a1.5 1.5 0 0 1 0 3H11v2h2.5A1.5 1.5 0 0 1 15 9.5V11h2a2 2 0 1 1 0 4h-2v2.5A1.5 1.5 0 0 1 13.5 19H9.5A1.5 1.5 0 0 1 8 17.5V15H6.5A1.5 1.5 0 0 1 5 13.5V9.5A1.5 1.5 0 0 1 6.5 8H8V6.5A3.5 3.5 0 0 1 9 3z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <span className="nav-label">Modules</span>
                </div>
                <div 
                    className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
                    onClick={() => onNavigate('settings')}
                >
                    <span className="nav-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 9.5A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5 12.5v-1l1.6-.4a1 1 0 0 0 .7-.7l.3-1.2-1-1 1.4-1.4 1 1 .9-.3.9-.2.4-1.7h2l.4 1.7 1.8.5 1-1 1.4 1.4-1 1 .3 1.2.2.9 1.7.4v2l-1.7.4-.4 1.8 1 1-1.4 1.4-1-1-1.2.3-.9.2L13.5 21h-2l-.4-1.7-1.8-.5-1 1-1.4-1.4 1-1-.3-1.2-.2-.9L5 14.5v-2z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <span className="nav-label">Settings</span>
                </div>
                <div 
                    className={`nav-item ${currentPage === 'info' ? 'active' : ''}`}
                    onClick={() => onNavigate('info')}
                >
                    <span className="nav-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M12 10v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            <circle cx="12" cy="8" r="0.9" fill="currentColor" />
                        </svg>
                    </span>
                    <span className="nav-label">Info</span>
                </div>
            </nav>

            <div className="privacy-badge">
                <div className="privacy-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="5" y="10" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
                        <path
                            d="M9 10V8.5C9 6.57 10.57 5 12.5 5C14.43 5 16 6.57 16 8.5V10"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                        />
                        <circle cx="12" cy="13.5" r="1" fill="currentColor" />
                    </svg>
                </div>
                <div>
                    <div className="privacy-title">PRIVACY ACTIVE</div>
                    <div className="privacy-text">All processing runs locally</div>
                    <div className="sidebar-footer">
                        © 2024 OKTRIX Gesture Systems • v1.0.2
                    </div>
                </div>
            </div>
        </div>
    );
}
