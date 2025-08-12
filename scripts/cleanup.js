/**
 * Script para remover arquivos e diretórios desnecessários após a consolidação
 */
const fs = require('fs');
const path = require('path');

console.log('Iniciando limpeza de arquivos desnecessários...');

// Lista de arquivos e diretórios a serem removidos
const toRemove = [
  path.join(__dirname, '../src/app.js'),
  path.join(__dirname, '../src/server.js'),
  path.join(__dirname, '../src/routes'),
  path.join(__dirname, '../src/middleware'),
  path.join(__dirname, '../src/middlewares'),
  path.join(__dirname, '../test-images.js')
];

// Função para remover um arquivo ou diretório recursivamente
function removeFileOrDir(pathToRemove) {
  try {
    if (fs.existsSync(pathToRemove)) {
      const stats = fs.statSync(pathToRemove);
      
      if (stats.isDirectory()) {
        console.log(`Removendo diretório: ${pathToRemove}`);
        // Listar conteúdo do diretório
        const files = fs.readdirSync(pathToRemove);
        
        // Remover cada arquivo/subdiretório
        for (const file of files) {
          const curPath = path.join(pathToRemove, file);
          removeFileOrDir(curPath);
        }
        
        // Remover o diretório vazio
        fs.rmdirSync(pathToRemove);
      } else {
        console.log(`Removendo arquivo: ${pathToRemove}`);
        fs.unlinkSync(pathToRemove);
      }
    } else {
      console.log(`Caminho não encontrado: ${pathToRemove}`);
    }
  } catch (err) {
    console.error(`Erro ao remover ${pathToRemove}: ${err.message}`);
  }
}

// Remover todos os itens da lista
for (const item of toRemove) {
  removeFileOrDir(item);
}

console.log('Limpeza concluída!');
