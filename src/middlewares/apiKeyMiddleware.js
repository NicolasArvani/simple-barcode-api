require('dotenv').config();

function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'API Key inválida ou ausente.' });
  }
  next();
}

module.exports = { apiKeyMiddleware };
