// Dashboard Component 
function Dashboard({ systemActive, handleToggle, handDetected, activationProgress, displayedGesture, displayedPlayPauseLabel, getGestureName, canvasRef }) {
    return (
        <>
            {/* Header */}
            <div className="header">
                <h1 className="page-title">Main Control Central</h1>
            </div>

            {/* Hero */}
            <div className="hero">
                <h2 className="hero-title">Move Freely.</h2>
                <p className="hero-subtitle">
                    Interact with your digital world using natural hand movements.
                </p>
                
                {/* Toggle */}
                <div className="system-toggle-container-hero">
                    <span className="toggle-label">SYSTEM STATE</span>
                    <button 
                        className={`toggle-button ${systemActive ? 'active' : ''}`}
                        onClick={handleToggle}
                    >
                        <span className="toggle-text">
                            {systemActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <div className="toggle-switch">
                            <div className={`toggle-knob ${systemActive ? 'active' : ''}`}></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Tracking Area */}
            <div className="tracking-container">
                <div className="status-badge">
                    <span>{handDetected ? 'HAND DETECTED' : 'AWAITING MOVEMENT'}</span>
                </div>

                {activationProgress > 0 && activationProgress < 1 && (
                    <div className="activation-progress">
                        <div className="progress-bar" style={{ width: `${activationProgress * 100}%` }}></div>
                        <span className="progress-text">
                             Activating... {Math.round(activationProgress * 100)}%
                        </span>
                    </div>
                )}

                <div className="canvas-wrapper">
                    <canvas ref={canvasRef} width={800} height={500} className="tracking-canvas" />
                </div>

                {displayedGesture && (
                    <div className="gesture-indicator">
                        {getGestureName(displayedGesture, displayedPlayPauseLabel)}
                    </div>
                )}

                <div className="tracking-status">
                    <div className="status-dot"></div>
                    <span>TRACKING ACTIVE</span>
                </div>
            </div>

            {/* Active Modules */}
            <div className="modules-section">
                <h3 className="section-title">ACTIVE MODULES</h3>
                <div className="modules-grid">
                    <ModuleCard icon={<IconMedia />} name="Media" active={true} />
                    <ModuleCard icon={<IconSystem />} name="System" />
                    <ModuleCard icon={<IconSlides />} name="Slides" />
                    <ModuleCard icon={<IconGame />} name="Game" />
                </div>
            </div>
        </>
    );
}

function ModuleCard({ icon, name, active = false }) {
    return (
        <div className={`module-card ${active ? 'active' : ''}`}>
            <div className="module-icon">{icon}</div>
            <div className="module-info">
                <div className="module-name">{name}</div>
                <div className="module-status">
                    <div className={`status-dot ${active ? 'active' : ''}`}></div>
                    <span className="status-text">{active ? 'ACTIVE' : 'STANDBY'}</span>
                </div>
            </div>
            <button className="module-toggle-btn">
                <span className={`power-icon ${active ? 'active' : ''}`}>⏻</span>
            </button>
        </div>
    );
}

function IconMedia() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
        </svg>
    );
}

function IconSystem() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor" />
            <circle cx="9" cy="7" r="1.3" fill="#0a0f0d" />
            <circle cx="15" cy="12" r="1.3" fill="#0a0f0d" />
            <circle cx="11" cy="17" r="1.3" fill="#0a0f0d" />
        </svg>
    );
}

function IconSlides() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11 10v4l3-2-3-2z" fill="currentColor" />
        </svg>
    );
}

function IconGame() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.5 8.5L10 7h4l2.5 1.5c1 .6 1.5 1.4 1.5 2.6V16c0 .8-.7 1.5-1.5 1.5-.6 0-1.1-.3-1.4-.8L13 14h-2l-2.1 2.7c-.3.5-.8.8-1.4.8-.8 0-1.5-.7-1.5-1.5v-4.9c0-1.2.5-2 1.5-2.6z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M9 11h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M8 10v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="15.5" cy="11" r="0.9" fill="currentColor" />
            <circle cx="17.5" cy="13" r="0.9" fill="currentColor" />
        </svg>
    );
}