const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ===== Janela =====
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),

  // ===== Informações do app =====
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => process.platform,

  // ===== Comunicação genérica (futuro) =====
  sendMessage: (channel, data) => {
    const validChannels = ['app:message'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  onMessage: (channel, callback) => {
    const validChannels = ['app:reply'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, data) => callback(data));
    }
  }
});