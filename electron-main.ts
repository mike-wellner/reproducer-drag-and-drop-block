import { app, BrowserWindow, protocol, ipcMain } from 'electron';
import { pathExists, readFile } from 'fs-extra';
import { join } from 'path';
import { fileURLToPath } from 'url';

let win;


/**
 * Register test protocol handler
 */
async function testProtocolRequest(request) {

  console.log('test-protocol request');

  try {
    const fileUri = request.url.replace(/^.*?:/, 'file:');
    const path = fileURLToPath(fileUri);

    if (await pathExists(path)) {
      console.log('path exists');
      
      return new Response(
        await readFile(path),
        { headers: { 'content-type': 'image/jpg' } }
      );
    }
  } catch (e) {}

  return Response.error();
}


/**
 * Create browser window (global)
 */
async function createWindow() {
  
  ipcMain.handle('get-app-path', () => app.getAppPath());
  
  ipcMain.handle('on-drag-start', (event: Electron.IpcMainInvokeEvent, filepath: string) => {
    console.log('on-drag-start');
    win.webContents.startDrag({ file: filepath, icon: join(app.getAppPath(), 'favicon.png') });
  });
  
  protocol.handle('test-protocol', testProtocolRequest);

  win = new BrowserWindow({
    width: 600,
    height: 600,
    backgroundColor: '#ffffff',
    webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true
    }
  })

  await win.loadURL('http://127.0.0.1:4200');
  win.on('closed', function () { win = null })

  setInterval( () => { 
    console.log('Sending toggle request');
    win.webContents.send('toggle-image');   
  }, 2000);
}


app.on('ready', createWindow)
app.on('window-all-closed', function () { if (process.platform !== 'darwin') { app.quit() } })
app.on('activate', function () { if (win === null) { createWindow() } })
