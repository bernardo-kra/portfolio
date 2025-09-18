export default function handler(req, res) {
  res.status(200).json({
    message: 'API de teste funcionando!',
    timestamp: new Date().toISOString(),
    data: {
      backend: 'Online',
      database: 'Conectado',
      status: 'Operacional'
    }
  });
}
