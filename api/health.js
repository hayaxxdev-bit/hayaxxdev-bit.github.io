// api/health.js (Vercel Serverless Function)
export default function handler(req, res) {
  // ═══════════════ SIMPLE CORS ═══════════════
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ═══════════════ MAINTENANCE CHECK ═══════════════
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  
  if (isMaintenance) {
    res.setHeader('X-Maintenance-Mode', 'true');
    return res.status(503).json({
      status: 'maintenance',
      message: 'Server is under maintenance',
      maintenance: true,
      timestamp: new Date().toISOString(),
    });
  }

  // ═══════════════ HEALTH RESPONSE ═══════════════
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}