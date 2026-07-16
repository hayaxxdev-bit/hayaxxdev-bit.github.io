<div align="center">

# 🍁 hayaxxdev-bit.github.io

### *"I don't want to get errors, so I'll max out my testing and clean code!"*

[![Typing SVG](https://readme-typing-svg.demolab.com/?font=Rubik+One&weight=500&size=26&duration=3000&pause=800&color=EB0000&center=true&vCenter=true&width=700&height=70&lines=Selamat+Datang+di+Shield+Zone;Portofolio+Digital+ala+Maple+%F0%9F%9B%A1%EF%B8%8F;Full-Stack+Web+Developer;Bofuri+Themed+Portfolio+%F0%9F%8D%81)](https://git.io/typing-svg)

[![Website](https://img.shields.io/badge/Live%20Site-hayaxxdev--bit.my.id-EB0000?style=for-the-badge&logo=vercel&logoColor=white)](https://hayaxxdev-bit.my.id)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-000000?style=for-the-badge&logo=github&logoColor=white)](https://hayaxxdev-bit.github.io)
[![License](https://img.shields.io/badge/License-MIT-9141AC?style=for-the-badge)](./LICENSE)
[![visitor badge](https://visitor-badge.laobi.icu/badge?page_id=hayaxxdev-bit.hayaxxdev-bit.github.io&left_text=visitors)](https://github.com/hayaxxdev-bit)

</div>

---

## 🍁 Tentang Situs Ini

Sama seperti **Maple** — yang mengubah pertahanan absolut menjadi kekuatan tak terkalahkan — repositori ini adalah fondasi digital tempat aku memamerkan proyek, skill, dan perjalanan sebagai web developer. Dibangun dari nol dengan estetika **dark cyber-manga**, dipadukan palet **Crimson × Onyx × Silver** yang terinspirasi dari armor *New Moon* milik Maple.

| | |
|---|---|
| 🧙 **Alias** | `hayaxxdev-bit` |
| 🛡️ **Peran** | Frontend / Fullstack Developer |
| 🎯 **Filosofi** | *Defense First, Then Conquer* — fondasi kode kuat, aman, dan rapi sebelum fitur baru |
| 🌐 **Live Demo** | [hayaxxdev-bit.my.id](https://hayaxxdev-bit.my.id) |

---

## 📚 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Galeri Interaktif](#-galeri-interaktif)
- [Tumpukan Teknologi](#%EF%B8%8F-tumpukan-teknologi)
- [Struktur Proyek](#-struktur-proyek)
- [Menjalankan Secara Lokal](#-menjalankan-secara-lokal)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Kontak & Sosial](#-kontak--sosial)
- [Lisensi](#-lisensi)

---

## ⚔️ Fitur Utama

<table>
<tr>
<td width="33%" valign="top">

### 🛡️ Status Bar
Skills grid bergaya *stats screen* RPG — HTML, CSS, JS, React, dsb ditampilkan layaknya parameter STR/VIT/AGI milik Maple.

</td>
<td width="33%" valign="top">

### 🗡️ The Shield Wall
Galeri proyek unggulan lengkap dengan deskripsi, tech-stack badge, dan tautan langsung ke demo/kode sumber.

</td>
<td width="33%" valign="top">

### 👼 Angel's Sanctuary
Zona kontak & sosial — email, GitHub, LinkedIn — didesain sebagai "sanctuary" untuk terhubung denganku.

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 🎬 Visual Novel Dialogue
Sistem dialog bergaya *visual novel* untuk memperkenalkan diri dan proyek dengan cara yang lebih imersif.

</td>
<td width="33%" valign="top">

### 🎵 BGM Player
Pemutar musik latar terintegrasi agar suasana menjelajah situs makin terasa seperti bermain game.

</td>
<td width="33%" valign="top">

### 🎰 Gacha System
Sistem gacha bertema kartu karakter anime ala TCG — lengkap dengan animasi holografik & sistem *pity*.

</td>
</tr>
</table>

> 🥚 **Easter Egg:** Coba masukkan **Konami Code** di halaman utama... 👀

---

## 🖼️ Galeri Interaktif

| Bagian | Deskripsi Singkat |
|---|---|
| 🏠 **Home** | Landing page dengan animasi perisai & efek hover heksagonal |
| 📊 **Status Bar** | Visualisasi skill teknis dalam format RPG stat sheet |
| 🛡️ **Shield Wall** | Showcase proyek dengan filter kategori |
| 🎴 **Gacha Zone** | Tarik kartu karakter anime kesayangan, kumpulkan koleksimu |
| 👼 **Sanctuary** | Formulir & tautan kontak |

---

## 🛠️ Tumpukan Teknologi

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)
![GitHub API](https://img.shields.io/badge/GitHub%20API-181717?style=for-the-badge&logo=github&logoColor=white)

</div>

**Sorotan implementasi:**
- ⚙️ Single-page routing tanpa framework berat
- 🔗 Integrasi GitHub API untuk data proyek real-time
- 💾 Gacha & koleksi karakter disimpan via `localStorage`
- 🎨 Animasi kustom (shield effect, hexagon hover, floating pet Syrup)

---

## 🌲 Struktur Proyek

```
hayaxxdev-bit.github.io/
├── assets/
│   ├── images/          # Ilustrasi, ikon daun maple, aset karakter
│   ├── audio/           # BGM player tracks
│   └── fonts/           # Font kustom bertema RPG
├── scripts/
│   ├── router.js        # Single-page routing
│   ├── gacha.js         # Logic sistem gacha & pity
│   ├── vn-dialogue.js   # Visual novel dialogue engine
│   └── konami.js        # Easter egg handler
├── styles/
│   ├── theme.css         # Palet warna Maple (Crimson/Onyx/Silver)
│   └── animations.css    # Shield & hexagon hover effects
├── index.html
├── vercel.json
└── README.md
```

---

## 💻 Menjalankan Secara Lokal

```bash
# 1. Clone repositori
git clone https://github.com/hayaxxdev-bit/hayaxxdev-bit.github.io.git

# 2. Masuk ke folder proyek
cd hayaxxdev-bit.github.io

# 3. Jalankan dengan live server (contoh menggunakan VSCode Live Server / npx)
npx serve .
```

Buka `http://localhost:3000` (atau port yang ditampilkan) di browser.

---

## 🚀 Deployment

| Platform | Status | Domain |
|---|---|---|
| **GitHub Pages** | ✅ Aktif | `hayaxxdev-bit.github.io` |
| **Vercel** | ✅ Aktif | `hayaxxdev-bit.my.id` |

Setiap push ke branch `main` akan otomatis memicu build & deploy ulang di kedua platform.

---

## 🗺️ Roadmap

- [x] Redesign tema Maple (Crimson/Gold/Black)
- [x] Sistem gacha kartu karakter dengan animasi holografik
- [x] Visual Novel dialogue system
- [x] Konami Code easter egg
- [ ] Dark/Light mode toggle
- [ ] Optimasi performa & lazy loading aset
- [ ] Integrasi blog/devlog

---

## 👼 Kontak & Sosial

<div align="center">

[![Website](https://img.shields.io/badge/Website-EB0000?style=for-the-badge&logo=vercel&logoColor=white)](https://hayaxxdev-bit.my.id)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hayaxxdev-bit)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your-email@example.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-linkedin)

</div>

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [MIT License](./LICENSE) — bebas digunakan sebagai inspirasi, tapi tetap hargai kerja keras di baliknya ya! 🍁

<div align="center">

**"自分が立っている場所が頂点だと決めたら、私は決して動かない。"**
*Jika aku memutuskan tempatku berdiri adalah puncak, aku tidak akan pernah bergerak dari sana.*

Made with 🛡️ and ☕ by **hayaxxdev-bit**

</div>3.  **Angel's Sanctuary (Contact & Socials):** Bagian khusus untuk terhubung dengan aku melalui email, GitHub, atau LinkedIn.

---

## 🛠️ Teknologi yang Digunakan

* **HTML5 & CSS3** (Dengan animasi kustom ala UI game RPG)
* **JavaScript (ES6+)** / Framework pilihan (React.js / Vue.js)
* **GitHub Pages** (Sebagai platform hosting utama)

---
