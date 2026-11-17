/*
 * KONFIGURASI AVESTORE
 *
 * Ubah identitas toko, kontak, kategori, dan produk di berkas ini.
 * Harga ditulis sebagai angka Rupiah tanpa tanda titik atau "Rp".
 * Contoh: 1250000 = Rp1.250.000
 *
 * Untuk menambah produk, salin salah satu objek di dalam products,
 * ubah id agar unik, lalu sesuaikan nama, kategori, harga, dan detailnya.
 * Nilai art harus cocok dengan salah satu kunci ilustrasi di script.js.
 * Isi image dengan URL langsung gambar dari internet atau jalur foto lokal.
 * Contoh URL: "https://situs.com/foto-produk.jpg".
 * Gunakan URL file gambar, bukan URL halaman pencarian atau halaman produk.
 * Harga boleh null agar ditampilkan sebagai "Harga dikonfirmasi toko".
 */
window.AVESTORE_CONFIG = {
  store: {
    name: "AveStore",
    tagline: "Temukan suara, ciptakan cerita.",
    description: "Tempat menemukan alat musik dan perlengkapan audio untuk menemani setiap proses berkarya.",
    heroImages: ["assets/produk/gibson-lespaul.jpg", "assets/produk/Roland FA-08 88-Key Workstation by Roland….jpg", "assets/produk/Tama Imperialstar 20_ 5pcs -HBK.jpg"],
    year: 2026
  },

  currency: "IDR",
  locale: "id-ID",

  contact: {
    address: "Indralaya, Mutiara Indah 2",
    city: "Indralaya",
    whatsapp: "+6282160061122",
    email: "lerrooktozha5@gmail.com",
    instagram: "https://www.instagram.com/lerro_oktozha/",
    tiktok: "https://www.tiktok.com/@oktozha",
    facebook: "",
    youtube: "https://www.youtube.com/@oktozha6769",
    businessHours: "12 Jam"
  },

  categories: [
  {
    id: "gitar",
    label: "Gitar",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Acoustic_guitar.jpg?width=600"
  },
  {
    id: "bass",
    label: "Bass",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bass_guitar_(instrument).jpg?width=600"
  },
  {
    id: "drum-perkusi",
    label: "Drum & Perkusi",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Drumskit.jpg?width=600"
  }
],

  products: [
    {
      id: "gibson-les-paul-custom-hitori",
      name: "Gibson Les Paul Custom",
      character: "Hitori Gotoh (Bocchi)",
      role: "Gitar utama",
      category: "gitar",
      art: "electricGuitar",
      image: "https://www.chicagomusicexchange.com/cdn/shop/products/gibson-electric-guitars-solid-body-gibson-custom-shop-les-paul-custom-ebony-gloss-lpc-ebgh1e-cs102768-28896290111623.jpg?v=1652840405",
      price: 94400000,
      oldPrice: 118000000,
      featured: true,
      description: "Gitar elektrik solid-body kelas atas dari lini Les Paul Custom. Model ini dikenal dengan konstruksi kokoh, karakter suara tebal, respons dinamis, dan sustain panjang. Varian Ebony modern menggunakan body mahoni dengan top maple, fingerboard ebony, serta pickup humbucker Gibson. Cocok untuk blues, rock, hard rock, hingga musik dengan distorsi tinggi.",
      highlights: [
        "Body mahoni dengan top maple",
        "Fingerboard ebony pada varian terkait",
        "Pickup humbucker Gibson",
        "Bridge Tune-O-Matic dan Stop Bar",
        "Hardware berlapis emas pada varian Ebony"
      ],
      variants: ["Hitam dengan hardware emas"]
    },

    {
      id: "yamaha-pacifica-611vfm-hitori",
      name: "Yamaha Pacifica 611VFM",
      character: "Hitori Gotoh (Bocchi)",
      role: "Gitar elektrik tambahan",
      category: "gitar",
      art: "electricGuitar",
      image: "assets/produk/Yamaha Pacifica611Vfm Trans Black - Guitares électriques _ Woodbrass.jpg",
      price: 6950000,
      oldPrice: 8822000,
      featured: true,
      description: "Gitar elektrik seri Pacifica 600 yang dirancang untuk fleksibilitas permainan. Menggunakan body alder dengan lapisan flamed maple veneer, leher maple, serta fingerboard rosewood. Kombinasi pickup Seymour Duncan Custom 5 humbucker dan SP90-1 P-90 menghasilkan karakter suara yang luas, mulai dari clean hingga distorsi. Dilengkapi Grover locking tuners dan Wilkinson VS50 tremolo.",
      highlights: [
        "Body alder dengan flamed maple veneer",
        "Pickup Seymour Duncan Custom 5 dan SP90-1",
        "Grover locking tuners",
        "Wilkinson VS50 tremolo bridge",
        "Fitur push-pull coil-split"
      ],
      variants: ["Translucent Black"]
    },

    {
      id: "gibson-les-paul-junior-double-cut-kita",
      name: "Gibson Les Paul Junior Double Cut",
      character: "Ikuyo Kita",
      role: "Gitar ritme & vokal",
      category: "gitar",
      art: "electricGuitar",
      image: "assets/produk/Epiphone Les Paul Special Double Cut 1960 Reissue Pelham Blue.jpg",
      price: 27000000,
      oldPrice: 29600000,
      featured: true,
      description: "Gitar elektrik dengan konstruksi solid-body mahoni dan desain double-cutaway yang memudahkan akses ke fret bagian atas. Pickup P-90 menghasilkan karakter suara terbuka, responsif, dan memiliki midrange kuat. Konfigurasi elektronik sederhana dengan kontrol volume dan tone memberikan pengoperasian praktis.",
      highlights: [
        "Body mahoni solid",
        "Pickup P-90",
        "Desain double-cutaway",
        "Kontrol volume dan tone",
        "Bridge wraparound"
      ],
      variants: ["Pelham Blue"]
    },

    {
      id: "fender-precision-bass-ryo",
      name: "Fender Precision Bass",
      character: "Ryo Yamada",
      role: "Bass",
      category: "bass",
      art: "bass",
      image: "https://r2.gear4music.com/media/117/1173042/1200/preview.jpg",
      price: 13508000,
      oldPrice: 16885000,
      featured: true,
      description: "Gitar bas elektrik klasik yang dikenal dengan karakter nada rendah yang solid, tegas, dan memiliki midrange kuat. Konfigurasi Precision Bass klasik menggunakan pickup split-coil untuk menghasilkan suara bas yang padat dan terdefinisi. Cocok untuk berbagai genre, mulai dari rock, pop, funk, hingga musik alternatif.",
      highlights: [
        "Desain Precision Bass klasik",
        "Pickup split-coil pada konfigurasi klasik",
        "Karakter low-end yang solid",
        "Kontrol volume dan tone",
        "Cocok untuk berbagai genre musik"
      ],
      variants: ["Putih dengan pickguard hitam"]
    },

    {
      id: "tama-imperialstar-22-nijika",
      name: "Tama Imperialstar 22\"",
      character: "Ijichi Nijika",
      role: "Drum & ketua band",
      category: "drum-perkusi",
      art: "drums",
      image: "assets/produk/Tama Imperialstar 20_ 5pcs -HBK.jpg",
      price: 13550000,
      oldPrice: null,
      featured: true,
      description: "Perangkat drum akustik dari seri Imperialstar yang dirancang untuk pemain pemula hingga menengah. Menggunakan shell poplar dengan konstruksi 6-ply berketebalan 8 mm untuk menghasilkan resonansi seimbang. Bass drum 22 inci memberikan karakter suara kick yang dalam dan bertenaga. Dilengkapi hardware yang dirancang untuk penggunaan latihan maupun pertunjukan.",
      highlights: [
        "Shell poplar 100%",
        "Konstruksi shell 6-ply, 8 mm",
        "Bass drum berukuran 22 inci",
        "Hardware double-braced",
        "Konfigurasi drum lengkap"
      ],
      variants: ["Merah antik"]
    }
  ],

  promotion: {
    badge: "Pilihan untuk mulai berkarya",
    title: "Perlengkapan yang tepat,",
    emphasis: "inspirasi tanpa batas.",
    description: "Temukan instrumen dan perlengkapan pendukung untuk mewujudkan ide musikmu.",
    button: "Jelajahi semua produk"
  }
};