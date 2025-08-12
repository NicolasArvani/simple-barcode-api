# Serviço de Código de Barras EAN13

API para leitura de código de barras em imagens usando ExpressJS, otimizada para códigos EAN13.

## Recursos

- Detecção de código de barras em imagens (jpg, png)
- Otimizado para códigos EAN13
- API REST para integração com outros sistemas
- Interface web simples para teste
- Suporte a validação de checksums

## Tecnologias Utilizadas

- Node.js
- Express.js
- Canvas (processamento de imagem)
- BarcodeDetector (detecção de códigos)
- Quagga2 (detecção de códigos alternativa)
- Multer (upload de arquivos)

## Instalação

```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd barcode

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar testes
npm test
```

## Requisitos

- Node.js v14+
- Dependências do Canvas (https://github.com/Automattic/node-canvas#compiling)

## Uso da API

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

## Interface Web

Uma interface web simples está disponível na rota raiz (`/`) para testar o serviço de detecção de código de barras.

## Testes

O projeto inclui testes automatizados para garantir o funcionamento correto do serviço de código de barras:

```bash
# Executar todos os testes
npm test

# Executar testes com watch mode
npm run test:watch
```

## Estrutura do Projeto

```
barcode/
├── examples/           # Imagens de exemplo para testes
├── public/             # Arquivos estáticos (interface web)
├── src/
│   ├── routes/         # Rotas da API
│   ├── services/       # Serviços de negócio
│   └── app.js          # Aplicação principal
├── temp/               # Diretório temporário para processamento
└── test/               # Testes automatizados
```

## Limitações

- O serviço é otimizado para códigos EAN13, mas pode detectar outros formatos como EAN8, Code39 e Code128
- A qualidade da imagem afeta significativamente a taxa de detecção
- Imagens com múltiplos códigos de barras retornarão apenas o primeiro detectado

## Licença

MIT
