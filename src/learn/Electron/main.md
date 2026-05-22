# Electron


## 渲染进程与主线程的交互


主进程接受消息

```javascript
import {ipcMain}   from 'electron';

ipcMain.handle('名称', (event,msg) => {
    // 处理
})

```

渲染进程发送消息

```javascript
electron.ipcRenderer.invoke('事件名称', {
    // 参数
})
```

### 控制主线程打开一个窗口


```javascript
ipcMian.handle('ws', (event, msg) => {
    if (msg.name === 'xxx') {
        const newWindow = new BrowserWindow({
            width: 500,
            height: 300,
            show: false,
            antoHideMenuBar: true,
            ...(process.platform === 'linux' ? {icon}: {}),
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false
            }
        })
        newWindow.on('ready-to-show', () => {
            listWindow.show()
        })
        listWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/list')
    }
})
```