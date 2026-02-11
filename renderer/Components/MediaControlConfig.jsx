// Media Control Configuration Page
function MediaControlConfig({ onNavigate }) {
    return (
        <div className="page-content">
            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => onNavigate('modules')}>Modules</span>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">Media Control Configuration</span>
            </div>

            <h1 className="page-title-large">Media Control Configuration</h1>
            <p className="page-subtitle">Active gesture-to-action mappings for media playback.</p>

            <div className="section-header">ACTIVE GESTURE MAPPINGS</div>

            <div className="gesture-mappings-list">
                {/* Open Palm - Play/Pause */}
                <div className="gesture-mapping-item">
                    <div className="gesture-icon">⏯</div>
                    <div className="gesture-info">
                        <div className="gesture-category">PLAYBACK</div>
                        <div className="gesture-name">Open Palm</div>
                        <div className="gesture-action">Play / Pause</div>
                    </div>
                    <div className="gesture-status">
                        <span className="status-label">Status</span>
                        <span className="status-value read-only">READ ONLY</span>
                    </div>
                </div>

                {/* Swipe Right - Next */}
                <div className="gesture-mapping-item">
                    <div className="gesture-icon">⏭</div>
                    <div className="gesture-info">
                        <div className="gesture-category">NAVIGATION</div>
                        <div className="gesture-name">Swipe Right</div>
                        <div className="gesture-action">Siguiente (Next)</div>
                    </div>
                    <div className="gesture-status">
                        <span className="status-label">Status</span>
                        <span className="status-value read-only">READ ONLY</span>
                    </div>
                </div>

                {/* Swipe Left - Previous */}
                <div className="gesture-mapping-item">
                    <div className="gesture-icon">⏮</div>
                    <div className="gesture-info">
                        <div className="gesture-category">NAVIGATION</div>
                        <div className="gesture-name">Swipe Left</div>
                        <div className="gesture-action">Anterior (Previous)</div>
                    </div>
                    <div className="gesture-status">
                        <span className="status-label">Status</span>
                        <span className="status-value read-only">READ ONLY</span>
                    </div>
                </div>

                {/* Swipe Up - Volume Up */}
                <div className="gesture-mapping-item">
                    <div className="gesture-icon">🔊</div>
                    <div className="gesture-info">
                        <div className="gesture-category">VOLUME</div>
                        <div className="gesture-name">Swipe Up</div>
                        <div className="gesture-action">Volumen + (Volume Up)</div>
                    </div>
                    <div className="gesture-status">
                        <span className="status-label">Status</span>
                        <span className="status-value read-only">READ ONLY</span>
                    </div>
                </div>

                {/* Swipe Down - Volume Down */}
                <div className="gesture-mapping-item">
                    <div className="gesture-icon">🔉</div>
                    <div className="gesture-info">
                        <div className="gesture-category">VOLUME</div>
                        <div className="gesture-name">Swipe Down</div>
                        <div className="gesture-action">Volumen - (Volume Down)</div>
                    </div>
                    <div className="gesture-status">
                        <span className="status-label">Status</span>
                        <span className="status-value read-only">READ ONLY</span>
                    </div>
                </div>
            </div>

            <div className="list-end">END OF MAPPING LIST</div>
        </div>
    );
}
