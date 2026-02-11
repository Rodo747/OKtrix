// Modules Page Component 
function Modules({ onNavigate }) {
    return (
        <div className="page-content">
            <h1 className="page-title-large">Control Modules</h1>
            <p className="page-subtitle">Configure and manage gesture-driven interfaces for your public space.</p>

            <div className="modules-grid-large">
                {/* Media Control */}
                <div className="module-card-large active">
                    <div className="module-badge active">ACTIVE</div>
                    <div className="module-icon-styled media">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h3 className="module-title">Media Control</h3>
                    <p className="module-description">
                        Manage audiovisual playback and volume with intuitive hand waves.
                    </p>
                    <div className="module-footer">
                        <span className="module-meta">Last updated: 2h ago</span>
                        <button 
                            className="btn-configure"
                            onClick={() => onNavigate('media-config')}
                        >
                            Configure ⚙
                        </button>
                    </div>
                </div>

                {/* Accessibility */}
                <div className="module-card-large active">
                    <div className="module-badge active">ACTIVE</div>
                    <div className="module-icon-styled accessibility">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="4" r="2" fill="currentColor"/>
                            <path d="M15.89 8.11C15.5 7.72 14.83 7 13.53 7h-2.54C8.24 6.99 6 4.75 6 2H4c0 3.16 2.11 5.84 5 6.71V22h2v-6h2v6h2V10.05L18.95 14l1.41-1.41-4.47-4.48z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h3 className="module-title">Accessibility</h3>
                    <p className="module-description">
                        Enhanced assistive features for inclusive public interactions.
                    </p>
                    <div className="module-footer">
                        <span className="module-meta">Standards compliant</span>
                        <button className="btn-configure">
                            Configure ⚙
                        </button>
                    </div>
                </div>


                {/* Presentation Control */}
                <div className="module-card-large active">
                    <div className="module-badge active">ACTIVE</div>
                    <div className="module-icon-styled presentation">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 3H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h5l-1 1v2h10v-2l-1-1h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V5h18v11z" fill="currentColor"/>
                            <path d="M9 8h2v8H9zm4-3h2v11h-2z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h3 className="module-title">Presentation Control</h3>
                    <p className="module-description">
                        Navigate slides and annotate in real-time without touching the screen.
                    </p>
                    <div className="module-footer">
                        <span className="module-meta">Pro mode enabled</span>
                        <button className="btn-configure">
                            Configure ⚙
                        </button>
                    </div>
                </div>


                {/* Lighting */}
                <div className="module-card-large active">
                    <div className="module-badge active">ACTIVE</div>
                    <div className="module-icon-styled gaming">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 7h12c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-2l-2 2h-4l-2-2H6c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2zm3 3a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h3 className="module-title">Gaming</h3>
                    <p className="module-description">
                        Gesture control for more immersive gaming experiences.
                    </p>
                    <div className="module-footer">
                        <span className="module-meta">Connected: 12 Nodes</span>
                        <button className="btn-configure">
                            Configure ⚙
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}