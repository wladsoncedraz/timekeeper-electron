const { ipcRenderer } = require('electron');
const timer = require('./timer');
const data = require('../../data');

let linkSobre = document.querySelector('#link-sobre');
let botaoPlay = document.querySelector('.botao-play');
let tempo = document.querySelector('.tempo');
let curso = document.querySelector('.curso');
let botaoAdicionar = document.querySelector('.botao-adicionar');
let campoAdicionar = document.querySelector('.campo-adicionar');
let imgs = ['img/play-button.svg', 'img/stop-button.svg'];
let play = false;

window.onload = () => {
    data.pegaDados(curso.textContent).then((data) => {
        tempo.textContent = data.tempo;
    }).catch((err) =>{
        console.log(err);
    });
}

linkSobre.addEventListener('click', function() {
    ipcRenderer.send('abrir-janela-sobre');
});

botaoPlay.addEventListener('click', function() {
    if(play){
        timer.parar(curso.textContent);
        play = false;
        new Notification('Timekeeper diz', {
            body: `O curso ${curso.textContent} foi pausado!`,
            icon: __dirname + '/app/img/stop-button.png'
        });
    }else{
        timer.iniciar(tempo);
        play = true;
        new Notification('Timekeeper diz', {
            body: `O curso ${curso.textContent} foi iniciado!`,
            icon: __dirname + '/app/img/play-button.png'
        });
    }

    imgs = imgs.reverse();
    botaoPlay.src = imgs[0];
});

ipcRenderer.on('curso-alterado', (event, nomeCurso) =>{
    timer.parar(nomeCurso);

    data.pegaDados(nomeCurso)
        .then((dados) =>{
            tempo.textContent = dados.tempo;
        }).catch((err) =>{
            console.log('Curso não possui o JSON!');
            tempo.textContent = '00:00:00';
        });

    curso.textContent = nomeCurso;
});

botaoAdicionar.addEventListener('click', function () {
    let nomeCurso = campoAdicionar.value;

    if(campoAdicionar.value == ''){
        console.log('Não foi possível adicionar o curso!');
        alert('Não foi possível adicionar o curso vazio!')
        
        return;
    }

    curso.textContent = nomeCurso;
    tempo.textContent = '00:00:00';
    campoAdicionar.value = '';
    
    ipcRenderer.send('curso-adicionado', nomeCurso);
});

ipcRenderer.on('atalho-iniciar-parar', () =>{
    // botaoPlay.click();
    let click = new MouseEvent('click');
    botaoPlay.dispatchEvent(click);
});