const jsonfile = require('jsonfile-promised');
const fs = require('fs');

module.exports = {
    salvaDados(curso, tempoEstudado){
        let pathCurso = __dirname + '/data/' + curso + '.json';
        
        if(fs.existsSync(pathCurso)){
            // Salva os dados do curso
            this.adicionaTempoAoCurso(pathCurso, tempoEstudado);
        }else{
            // Cria o arquivo para o curso
            this.criaArquivoDeCurso(pathCurso, {}).then(() =>{
                // Salva os dados do curso no arquivo criado acima
                this.adicionaTempoAoCurso(pathCurso, tempoEstudado);
            });
        }
    },
    adicionaTempoAoCurso(pathCurso, tempo){
        let data = {
            ultimoEstudo: new Date().toString(),
            tempo: tempo
        }

        jsonfile.writeFile(pathCurso, data, { spaces: 2 }).then(() =>{
            console.log('Dados do curso foram salvo com sucesso!');
        }).catch((err) =>{
            console.log(err);
        });
    },
    criaArquivoDeCurso(pathCurso, content){
        return jsonfile.writeFile(pathCurso, content, { spaces: 2 })
            .then(() =>{
                console.log('Arquivo para o curso criado com sucesso!');
            }).catch((err) =>{
                console.log(err);
            });
    },
    pegaDados(curso){
        let path = __dirname + '/data/' + curso + '.json';

        return jsonfile.readFile(path);
    },
    pegaNomeCursos(){
        let arquivos = fs.readdirSync(__dirname + '/data');
        let cursos = arquivos.map((item) => {
            return item.substr(0, item.lastIndexOf('.'));
        });

        return cursos;
    }
}