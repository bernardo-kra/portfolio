export default function handler(req, res) {
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
}
