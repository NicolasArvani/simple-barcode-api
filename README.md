# Serviço de Código de Barras EAN13

API para leitura de código de barras em imagens usando ExpressJS, otimizada para códigos EAN13.

## Recursos

- Detecção de código de barras em imagens (jpg, png)
- Otimizado para códigos EAN13
- API REST com autenticação por API Key
- Interface web para teste e demonstração
- Suporte a validação de checksums

## Tecnologias Utilizadas

- Node.js
- Express.js
- Canvas (processamento de imagem)
- Quagga2 (detecção de códigos)
- Multer (upload de arquivos)

## Instalação

```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd barcode

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env e configure sua API_KEY
```

## Requisitos

- Node.js v18+
- Dependências do Canvas (https://github.com/Automattic/node-canvas#compiling)

## Uso

### Iniciar o servidor

```bash
# Executar em produção
npm start

# Executar em desenvolvimento com auto-reload
npm run dev
```

### Acessar a interface web

Abra o navegador em:
```
http://localhost:3000
```

## Uso da API

### Autenticação

Todas as rotas da API requerem um cabeçalho `x-api-key` com a chave API configurada no arquivo .env.
Em ambiente de desenvolvimento (NODE_ENV=development), a autenticação é desabilitada.

### Verificar API Key

```
GET /api/check-key
```

**Resposta:**
```json
{
  "success": true,
  "message": "API Key válida"
}
```

### Decodificar código de barras

```
POST /api/barcode/decode
```

**Parâmetros de Corpo (multipart/form-data):**
- `image` - Arquivo de imagem contendo o código de barras

**Resposta:**
```json
{
  "success": true,
  "barcode": "5901234123457"
}
```

### Obter informações de um código de barras

```
GET /api/barcode/info/:barcode
```

**Parâmetros de URL:**
- `barcode` - O código de barras para obter informações

**Resposta:**
```json
{
  "success": true,
  "barcode": "5901234123457",
  "type": "EAN-13",
  "isValid": true
}
```

## Testes

O projeto inclui testes automatizados para garantir o funcionamento correto do serviço:

```bash
# Executar todos os testes
npm test
```

## Estrutura do Projeto

```
barcode/
├── examples/           # Imagens de exemplo para testes
├── public/             # Arquivos estáticos (interface web)
├── scripts/            # Scripts utilitários
├── src/
│   └── services/       # Serviços de negócio (BarcodeService)
├── temp/               # Diretório temporário para processamento
├── test/               # Testes automatizados
└── server.js           # Aplicação principal e ponto de entrada
```

## Pré-processamento de Imagens

O serviço realiza os seguintes processamentos na imagem para melhorar a taxa de detecção:
1. Ajuste de contraste
2. Conversão para escala de cinza

## Limitações

- O serviço é otimizado para códigos EAN13 e EAN8
- A qualidade da imagem afeta significativamente a taxa de detecção
- Imagens com múltiplos códigos de barras retornarão apenas o primeiro detectado

## Licença

MIT
