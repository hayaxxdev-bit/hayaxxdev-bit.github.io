// api/health.js (Vercel Serverless Function)
export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://hayaxxdev-bit.my.id');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check maintenance mode (bisa dari env variable)
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  
  if (isMaintenance) {
    res.setHeader('X-Maintenance-Mode', 'true');
    return res.status(503).json({
      status: 'maintenance',
      message: 'Server is under maintenance',
      maintenance: true
    });
  }

  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}