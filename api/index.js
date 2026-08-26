import app from '../backend/src/app.js';

export default function handler(req, res) {
  if (req.url) {
    req.url = req.url.replace(/^\/api\/index\.js/, '').replace(/^\/index\.js/, '');
    if (!req.url || req.url === '') {
      req.url = '/';
    }
  }
  return app(req, res);
}
