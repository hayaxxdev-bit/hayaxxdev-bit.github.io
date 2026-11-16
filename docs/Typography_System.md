Tipografi harus konsisten diseluruh halaman

```
|Peran|	                |Kandidat font|	|Penggunaan|
Brand dan heading	    Sora    	    Judul dan identitas
Body text	            Inter	        Paragraf dan deskripsi
Technical text	        JetBrains Mono	Label teknis, kode, dan metadata
```

# 4.1 Hierarki Tipografi
    Display heading.
    Heading level 1.
    Heading level 2.
    Heading level 3.
    Body text.
    Small text.
    Eyebrow label.
    Code dan metadata.
```Gunakan rem untuk sebagian besar ukuran font dan pertimbangkan clamp() untuk heading yang responsif.```

# 4.2 Aturan Tipografi
 Batasi jumlah keluarga font 
 Jangan menggunakan font dekoratif untuk paragraf panjang
 Jaga Panjang baris agar mudah dibaca
 Gunakan font monoscope hanya ketika karakter teknis memang membantu 
 Jangan mengandakjan huruf kapitak untuk seluruh konten
 Pastikan ukuran teks tetap nyaman pada layar kecil

 # 4.3 Font Asset Preparation
 Jika menggunakan font eksternal:
- Simpan file font yang benar-benar digunakan.
- Utamakan format WOFF2 jika tersedia.
- Periksa lisensi penggunaan web.
- Muat hanya bobot font yang dibutuhkan.
- Gunakan fallback system font.
- Hindari memuat banyak font hanya untuk satu elemen dekoratif.