// /api/health.js
export default function handler(req, res) {
  // CORS headers - izinkan akses dari domain GitHub Pages kamu
  const allowedOrigins = [
    'https://hayaxxdev-bit.my.id',
    'https://hayaxxdev-bit.github.io',
    'http://localhost:3000',
    'http://localhost:5500'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Cek maintenance mode dari environment variable
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  
  if (isMaintenance) {
    return res.status(503).json({
      status: 'maintenance',
      maintenance: true,
      message: 'Server sedang dalam pemeliharaan. Silakan coba lagi nanti.',
      estimatedDowntime: process.env.MAINTENANCE_ESTIMATE || '1-2 jam',
      timestamp: new Date().toISOString()
    });
  }
  
  // Semua normal
  return res.status(200).json({
    status: 'healthy',
    maintenance: false,
    version: '2.4.1',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}