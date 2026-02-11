// Info Page Component
function Info() {
    return (
        <div className="page-content">
            <div className="version-badge">Version V1.0.2</div>

            <h1 className="page-title-hero">OKTRIX The Next Dimension of Human-Computer Interaction</h1>
            <p className="page-subtitle-large">
                OKTRIX is a privacy-first, open-source bridge between physical movement and 
                digital response, redefining human-computer interaction through advanced computer vision.
            </p>

            <div className="info-grid">
               
                <div className="info-card">
                    <h3 className="info-card-title">DEVELOPER</h3>
                    <h2 className="developer-name">Rodolfo Soliz Barrientos</h2>
                    <p className="developer-role">Lead Interaction Architect and Developer</p>
                </div>

                
                <div className="info-card">
                    <h3 className="info-card-title">MOTIVATION</h3>
                    <p className="motivation-quote">
                        "OKTrix was born from the conviction that the way we interact with computers has become outdated: 
                        my vision is to create an immersive experience where the body becomes the remote control, 
                        eliminating physical barriers and bringing technology closer to how we actually move and live. 
                        This project is not just a technical experiment, but the first step towards a freer, more natural 
                        and safer human-computer interaction, a vision that I want to continue developing and expanding."
                    </p>
                </div>
            </div>

           
            <div className="privacy-commitment">
                <div className="commitment-header">
                    <h2 className="commitment-title">OKtrix Privacy Commitment</h2>
                        <div className="commitment-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                </div>

                <div className="privacy-features">
                    <div className="privacy-feature">
                        <div className="feature-check">✓</div>
                        <div className="feature-content">
                            <h4 className="feature-title">No video recording</h4>
                            <p className="feature-description">
                                Streams are processed frame by frame and never stored.
                            </p>
                        </div>
                    </div>

                    <div className="privacy-feature">
                        <div className="feature-check">✓</div>
                        <div className="feature-content">
                            <h4 className="feature-title">No cloud processing</h4>
                            <p className="feature-description">
                                100% local inference on your own hardware.
                            </p>
                        </div>
                    </div>

                    <div className="privacy-feature">
                        <div className="feature-check">✓</div>
                        <div className="feature-content">
                            <h4 className="feature-title">Zero Telemetry</h4>
                            <p className="feature-description">
                                No usage data or analytics sent to external servers.
                            </p>
                        </div>
                    </div>

                    <div className="privacy-feature">
                        <div className="feature-check">✓</div>
                        <div className="feature-content">
                            <h4 className="feature-title">Encrypted Local Data</h4>
                            <p className="feature-description">
                                Your custom profiles remain on your machine.
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
