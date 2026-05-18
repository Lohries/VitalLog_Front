const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const startUrl = app.isPackaged
    ? `file://${path.join(__dirname, '../dist/vital-log-front/browser/index.html')}`
    : 'http://localhost:4200';

  win.loadURL(startUrl);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// ===== Fechar app no Windows/Linux =====
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ===== IPC =====

// Minimizar janela
ipcMain.on('window:minimize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

// Maximizar/restaurar janela
ipcMain.on('window:maximize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

// Fechar janela
ipcMain.on('window:close', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

// Pegar versão do app
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

// Exemplo de comunicação
ipcMain.on('app:message', (event, data) => {
  console.log('Mensagem do Angular:', data);
  event.reply('app:reply', {
    received: true,
    message: 'Mensagem recebida com sucesso!'
  });
});