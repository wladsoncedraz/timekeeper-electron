const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron');
const data = require('./data');
const templateGenerator = require('./template');

let tray = null;
let mainWindow = null;
let sobreWindow = null;

// Processo principal da aplicação
app.on('ready', () => {

    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        }
    });

    tray = new Tray(__dirname + '/app/img/icon.png');
    let template = templateGenerator.geraTrayTemplate(mainWindow);
    let trayMenu = Menu.buildFromTemplate(template);
    tray.setContextMenu(trayMenu);

    let templateMenu = templateGenerator.geraMenuPrincipalTemplate(app);
    let menuPrincipal = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menuPrincipal);

    // Define atalho para iniciar e parar o contador
    globalShortcut.register('CmdOrCtrl+Shift+W', () =>{
        mainWindow.send('atalho-iniciar-parar');
    });

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
});

// Encerra a aplicação quando todas as janelas são fechadas
app.on('window-all-closed', () => {
    app.quit();
});

ipcMain.on('abrir-janela-sobre', () =>{
    if(sobreWindow == null){
        sobreWindow = new BrowserWindow({
            width: 350,
            height: 220,
            alwaysOnTop: true,
            frame: false,
            webPreferences: {
                nodeIntegration: true
            }
        });

        sobreWindow.on('closed', () =>{
            sobreWindow = null;
        });
    }

    sobreWindow.loadURL(`file://${__dirname}/app/sobre.html`);
});

ipcMain.on('fechar-janela-sobre', () =>{
    sobreWindow.close();
});

ipcMain.on('curso-parado', (event, curso, tempoEstudado) =>{
    data.salvaDados(curso, tempoEstudado);
});

ipcMain.on('curso-adicionado', (event, nomeCurso) =>{
    let novoTemplate = templateGenerator.adicionaCursoNoTray(nomeCurso, mainWindow);
    let novotrayMenu = Menu.buildFromTemplate(novoTemplate);
    
    tray.setContextMenu(novotrayMenu);
});