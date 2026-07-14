export default async function handler(req, res) {
  // Izinkan GitHub Pages kamu mengakses API ini
  res.setHeader('Access-Control-Allow-Origin', 'https://hayaxxdev-bit.my.id');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Teknik Caching: Menyimpan hasil di browser pengunjung selama 5 menit
  // dan di server Vercel selama 10 menit agar tidak terus-terusan menembak GitHub
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');

  try {
    const response = await fetch('https://api.github.com/users/hayaxxdev-bit/repos', {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'hayaxxdev-portfolio'
      }
    });
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}