const { useState, useEffect, useRef } = React;


function App() {
    // Page routing
    const [currentPage, setCurrentPage] = useState('dashboard');
    
    // Dashboard state
    const [socket, setSocket] = useState(null);
    const [systemActive, setSystemActive] = useState(true);
    const [displayedGesture, setDisplayedGesture] = useState(null);
    const [displayedPlayPauseLabel, setDisplayedPlayPauseLabel] = useState(null);
    const [handDetected, setHandDetected] = useState(false);
    const [activationProgress, setActivationProgress] = useState(0);
    const canvasRef = useRef(null);
    const gestureTimeoutRef = useRef(null);

    useEffect(() => {
        if (window.electron) {
            window.electron.getBackendPort().then(port => {
                const newSocket = io(`http://localhost:${port}`);

                newSocket.on('connect', () => {
                    console.log('✅ Connected');
                    newSocket.emit('start_tracking');
                });

                newSocket.on('tracking_update', (data) => {
                    setHandDetected(data.hand_detected);
                    setActivationProgress(data.activation_progress || 0);
                    
                    if (data.system_active !== undefined) {
                        setSystemActive(data.system_active);
                    }

                    if (data.current_gesture) {
                        if (data.current_gesture !== 'system_toggle') {
                            setDisplayedGesture(data.current_gesture);
                            setDisplayedPlayPauseLabel(data.play_pause_display || null);
                            
                            if (gestureTimeoutRef.current) {
                                clearTimeout(gestureTimeoutRef.current);
                            }
                            
                            gestureTimeoutRef.current = setTimeout(() => {
                                setDisplayedGesture(null);
                                setDisplayedPlayPauseLabel(null);
                            }, 2000);
                        }
                    }

                    if (data.tracking_frame && canvasRef.current) {
                        const img = new Image();
                        img.onload = () => {
                            const ctx = canvasRef.current.getContext('2d');
                            ctx.drawImage(img, 0, 0, 800, 500);
                        };
                        img.src = data.tracking_frame;
                    }
                });

                setSocket(newSocket);
            });

            window.electron.onSetSystemState((active) => {
                setSystemActive(active);
            });
        }

        return () => {
            if (socket) socket.disconnect();
            if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
        };
    }, []);

    function handleToggle() {
        const newState = !systemActive;
        setSystemActive(newState);
        if (socket) {
            socket.emit('toggle_system', { active: newState });
        }
        if (window.electron) {
            window.electron.notifySystemState(newState);
        }
    }

    function getGestureName(g, playPauseLabel = null) {
        if (g === 'play_pause') {
            return playPauseLabel === 'PAUSE' ? 'PAUSE' : 'PLAY';
        }
        const names = {
            'swipe_left': 'PREVIOUS',
            'swipe_right': 'NEXT',
            'swipe_up': 'VOLUME UP',
            'swipe_down': 'VOLUME DOWN'
        };
        return names[g] || g;
    }

    // Render current page
    function renderPage() {
        switch(currentPage) {
            case 'dashboard':
                return <Dashboard 
                    systemActive={systemActive}
                    handleToggle={handleToggle}
                    handDetected={handDetected}
                    activationProgress={activationProgress}
                    displayedGesture={displayedGesture}
                    displayedPlayPauseLabel={displayedPlayPauseLabel}
                    getGestureName={getGestureName}
                    canvasRef={canvasRef}
                />;
            case 'modules':
                return <Modules onNavigate={setCurrentPage} />;
            case 'media-config':
                return <MediaControlConfig onNavigate={setCurrentPage} />;
            case 'settings':
                return <Settings />;
            case 'info':
                return <Info />;
            default:
                return <Dashboard 
                    systemActive={systemActive}
                    handleToggle={handleToggle}
                    handDetected={handDetected}
                    activationProgress={activationProgress}
                    displayedGesture={displayedGesture}
                    displayedPlayPauseLabel={displayedPlayPauseLabel}
                    getGestureName={getGestureName}
                    canvasRef={canvasRef}
                />;
        }
    }

    return (
        <div className="container">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            
            <div className="main-content">
                <SystemIndicator isActive={systemActive} />
                {renderPage()}
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
