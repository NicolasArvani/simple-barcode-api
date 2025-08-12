/**
 * Middleware para autenticação por API Key
 */

/**
 * Verifica se a API Key é válida
 * @param {string} apiKey - A API key a ser verificada
 * @returns {boolean} - Verdadeiro se a API key for válida
 */
const isValidApiKey = (apiKey) => {
  // Obtém a API Key do arquivo .env
  const validApiKey = process.env.API_KEY;
  
  // Se não houver API Key configurada, considera inválida
  if (!validApiKey) {
    console.error('API_KEY não configurada no arquivo .env');
    return false;
  }
  
  return apiKey === validApiKey;
};

/**
 * Middleware para verificar a autenticação via API Key
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Próxima função na cadeia de middleware
 */
const apiKeyAuth = (req, res, next) => {
  // Em ambiente de desenvolvimento, bypass de autenticação
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  // Extrair a API Key do cabeçalho da requisição
  const apiKey = req.headers['x-api-key'];
  
  // Verificar se a API Key foi fornecida
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API Key não fornecida. Use o cabeçalho "x-api-key"'
    });
  }
  
  // Verificar se a API Key é válida
  if (!isValidApiKey(apiKey)) {
    return res.status(403).json({
      success: false,
      message: 'API Key inválida'
    });
  }
  
  // API Key válida, continua o processamento
  next();
};

module.exports = apiKeyAuth;
