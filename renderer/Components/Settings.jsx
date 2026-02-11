// Settings Page Component
function Settings() {
    const [sensitivity, setSensitivity] = React.useState(50); // 0-100 (Optimal = 50)

    const getSensitivityLabel = () => {
        if (sensitivity < 33) return 'Stable';
        if (sensitivity < 66) return 'Optimal';
        return 'Reactive';
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        backdropFilter: 'blur(2px)'
    };

    const badgeStyle = {
        backgroundColor: '#0a0f0d',
        color: '#7DD3C0',
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid #7DD3C0',
        fontWeight: '600',
        fontSize: '0.9rem',
        letterSpacing: '0.05em'
    };

    const disabledContentStyle = {
        opacity: 0.3,
        pointerEvents: 'none',
        filter: 'grayscale(0.8)'
    };

    return (
        <div className="page-content">
            <h1 className="page-title-large">System Settings</h1>
            <p className="page-subtitle">Manage the operational parameters of the OKTRIX contactless control unit.</p>

            {/* Language Section */}
            <div className="settings-section" style={{ position: 'relative' }}>
                <div style={overlayStyle}>
                    <span style={badgeStyle}>COMING SOON</span>
                </div>
                <div style={disabledContentStyle}>
                    <div className="section-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M4 12h16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                            <path d="M12 4c2 2.2 3 4.9 3 8s-1 5.8-3 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                            <path d="M12 4c-2 2.2-3 4.9-3 8s1 5.8 3 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="section-title">Language</h2>

                    <div className="form-group">
                        <label className="form-label">Interface Language</label>
                        <select className="form-select">
                            <option>English (United States)</option>
                            <option>Español (España)</option>
                            <option>Français (France)</option>
                            <option>Deutsch (Deutschland)</option>
                        </select>
                        <p className="form-help">
                            Adjust the language used across the system display and audio prompts.
                        </p>
                    </div>
                </div>
            </div>

            {/* Gesture Sensitivity Section */}
            <div className="settings-section" style={{ position: 'relative' }}>
                <div style={overlayStyle}>
                    <span style={badgeStyle}>COMING SOON</span>
                </div>
                <div style={disabledContentStyle}>
                    <div className="section-header-row">
                        <div>
                            <div className="section-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="8" cy="16" r="1.4" fill="currentColor" />
                                    <path d="M10.2 13.8a3.5 3.5 0 0 1 0 4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                    <path d="M12.7 11.8a6.3 6.3 0 0 1 0 8.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                    <path d="M15.2 9.8a9 9 0 0 1 0 12.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h2 className="section-title">Gesture Sensitivity</h2>
                        </div>
                        <div className="calibration-badge">ACTIVE CALIBRATION</div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Detection Range & Precision</label>
                        
                        <div className="slider-container">
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={sensitivity}
                                onChange={(e) => setSensitivity(parseInt(e.target.value))}
                                className="sensitivity-slider"
                            />
                            <div className="slider-track-fill" style={{width: `${sensitivity}%`}}></div>
                        </div>

                        <div className="slider-labels">
                            <div className="slider-label-group">
                                <span className="slider-label-top">DECREASED</span>
                                <span className={`slider-label-bottom ${sensitivity < 33 ? 'active' : ''}`}>
                                    Stable
                                </span>
                            </div>
                            <div className="slider-label-group center">
                                <span className="slider-label-top">STANDARD</span>
                                <span className={`slider-label-bottom ${sensitivity >= 33 && sensitivity < 66 ? 'active' : ''}`}>
                                    Optimal
                                </span>
                            </div>
                            <div className="slider-label-group right">
                                <span className="slider-label-top">INCREASED</span>
                                <span className={`slider-label-bottom ${sensitivity >= 66 ? 'active' : ''}`}>
                                    Reactive
                                </span>
                            </div>
                        </div>

                        <div className="sensitivity-note">
                            <p className="form-help">
                                Note: Higher sensitivity enables detection from greater distances but may increase false 
                                triggers in crowded public spaces.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="settings-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Changes</button>
            </div>
        </div>
    );
}
