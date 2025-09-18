export default function handler(req, res) {
  const { pathname } = new URL(req.url, `https://${req.headers.host}`);
  
  if (pathname === '/api/health') {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      message: 'Backend funcionando perfeitamente!'
    });
  } else if (pathname === '/api/test') {
    res.status(200).json({
      message: 'API de teste funcionando!',
      timestamp: new Date().toISOString(),
      data: {
        backend: 'Online',
        database: 'Conectado',
        status: 'Operacional'
      }
    });
  } else if (pathname === '/api/chat') {
    if (req.method === 'GET') {
      res.status(200).json({
        message: 'Chat API funcionando!',
        timestamp: new Date().toISOString(),
        status: 'ready'
      });
    } else if (req.method === 'POST') {
      const { message } = req.body;
      res.status(200).json({
        success: true,
        message: 'Mensagem recebida!',
        received: message,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(405).json({
        error: 'Método não permitido',
        allowed: ['GET', 'POST']
      });
    }
  } else {
    res.status(404).json({
      error: 'Endpoint não encontrado',
      path: pathname
    });
  }
}
