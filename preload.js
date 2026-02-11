// OKTrix Preload
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getBackendPort: () => ipcRenderer.invoke('get-backend-port'),
    onBackendPort: (callback) => ipcRenderer.on('backend-port', (_, port) => callback(port)),
    onSetSystemState: (callback) => ipcRenderer.on('set-system-state', (_, active) => callback(active)),
    notifySystemState: (active) => ipcRenderer.send('system-state-changed', active),
    openMainWindow: () => ipcRenderer.send('open-main-window')  // NUEVO
});