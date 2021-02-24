const data = require('./data');
const { ipcMain } = require('electron');

module.exports = {
    templateInicial: null,
    geraTrayTemplate(win) {
        let template = [
            {
                'label': 'Cursos'
            },
            {
                type: 'separator'
            }
        ];

        let cursos = data.pegaNomeCursos();

        cursos.forEach((curso) =>{
            let menuItem = {
                label: curso,
                type: 'radio',
                click: () => {
                    win.send('curso-alterado', curso);
                }
            }

            template.push(menuItem);
        });

        this.templateInicial = template;
        return template;
    },
    adicionaCursoNoTray(nomeCurso, win){
        this.templateInicial.push({
            label: nomeCurso,
            type: 'radio',
            checked: true,
            click: () => {
                win.send('curso-alterado', nomeCurso);
            }
        });

        return this.templateInicial;
    },
    geraMenuPrincipalTemplate(app){
        let templateMenu = [
        {
            label: 'View',
            submenu: [{
                role: 'reload'
            },
            {
                role: 'toggledevtools'
            }]
        },
        {
            label: 'Window',
            submenu: [
                {
                    role: 'minimize'
                },
                {
                    role: 'close'
                }
            ]
        },
        {
            label: 'Sobre',
            submenu: [
                {
                    label: 'Sobre o Timer',
                    click: () =>{
                        ipcMain.emit('abrir-janela-sobre');  
                    },
                    accelerator: 'CommandOrControl+I'
                }
            ]
        }];
    
        // Trata o menu para MAC
        if(process.platform == 'darwin'){
            templateMenu.unshift({
                label: app.getName(),
                submenu: [
                    {
                        label: 'Rodando o aplicativo no MAC!'
                    }
                ]
            });
        }
    
        return templateMenu;
    }
}