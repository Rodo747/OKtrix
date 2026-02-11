// OKTrix Main Process 
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow = null;
let floatingWidget = null; 
let tray = null;
let pythonProcess = null;
const BACKEND_PORT = 5847;

// Start Python backend
function startPythonBackend() {
    return new Promise((resolve, reject) => {
        console.log('🐍 Starting backend...');
        
        pythonProcess = spawn('python', ['backend_server.py', BACKEND_PORT.toString()]);

        let timeout = setTimeout(() => reject(new Error('Timeout')), 15000);

        pythonProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            console.log(`[Backend] ${output}`);
            
            if (output.includes('Backend ready')) {
                clearTimeout(timeout);
                resolve();
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`[Error] ${data}`);
        });
    });
}

// Create main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        backgroundColor: '#0a0f0d',
        show: false,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.webContents.send('backend-port', BACKEND_PORT);
    });

    mainWindow.on('close', (e) => {
        if (!app.isQuitting) {
            e.preventDefault();
            mainWindow.hide();
        }
    });
}

// NUEVO: Create floating widget
function createFloatingWidget() {
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    floatingWidget = new BrowserWindow({
        width: 80,
        height: 80,
        x: width - 100,   
        y: 20,  
        frame: false,    
        transparent: true,
        alwaysOnTop: true, 
        skipTaskbar: true, 
        resizable: false,
        minimizable: false,
        maximizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    floatingWidget.loadFile(path.join(__dirname, 'renderer', 'widget.html'));
    
    // Hacer la ventana arrastrable
    floatingWidget.setIgnoreMouseEvents(false);
    
    // Click en el widget abre la ventana principal
    floatingWidget.webContents.on('did-finish-load', () => {
        floatingWidget.webContents.send('backend-port', BACKEND_PORT);
    });
}

// Create tray
function createTray() {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    
    const updateMenu = (isActive) => {
        const menu = Menu.buildFromTemplate([
            { label: 'Show OKTrix', click: () => mainWindow.show() },
            { type: 'separator' },
            {
                label: 'Widget',
                submenu: [
                    {
                        label: floatingWidget && floatingWidget.isVisible() ? 'Hide Widget' : 'Show Widget',
                        click: () => {
                            if (floatingWidget) {
                                if (floatingWidget.isVisible()) {
                                    floatingWidget.hide();
                                } else {
                                    floatingWidget.show();
                                }
                            }
                        }
                    }
                ]
            },
            { type: 'separator' },
            { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); }}
        ]);
        
        tray.setContextMenu(menu);
    };
    
    updateMenu(true);
    tray.on('click', () => mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show());
    
    ipcMain.on('system-state-changed', (event, isActive) => {
        updateMenu(isActive);
    });
}

ipcMain.handle('get-backend-port', () => BACKEND_PORT);

// IPC para abrir ventana principal desde widget
ipcMain.on('open-main-window', () => {
    if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
    }
});

app.whenReady().then(async () => {
    try {
        await startPythonBackend();
        createWindow();
        createFloatingWidget();  // NUEVO: crear widget flotante
        createTray();
    } catch (err) {
        console.error('Failed:', err);
        app.quit();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    if (pythonProcess) pythonProcess.kill();
});