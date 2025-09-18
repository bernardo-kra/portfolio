export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    message: 'Backend funcionando perfeitamente!',
    method: req.method,
    url: req.url
  });
}