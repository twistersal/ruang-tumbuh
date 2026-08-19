# Audit PWA Lama dan Panduan Distribusi — Ruang Tumbuh

## Kesimpulan Utama

Kode terlampir adalah **PWA berbasis browser**, bukan paket aplikasi Android atau iOS. Berkas `index.html`, `app.js`, `styles.css`, `manifest.json`, dan `sw.js` tidak dapat langsung diunduh lalu dipasang sebagai aplikasi di smartphone. Agar dapat dipasang, PWA perlu dilayani melalui HTTPS, memiliki manifest yang ditemukan browser, dan service worker yang berhasil dipasang. Repository GitHub juga belum otomatis menjadi situs yang dapat dipasang; proyek harus dipublikasikan, misalnya melalui GitHub Pages atau host HTTPS lain.

Versi baru di proyek ini menggunakan Expo/React Native. Konten aplikasi dan data jurnal disimpan lokal melalui AsyncStorage, sehingga fitur inti tetap dapat dipakai setelah aplikasi dipasang—even when the device is offline. Paket instalasi native dibangun melalui tombol **Publish** pada antarmuka proyek, bukan dengan mengunduh berkas sumber satu per satu.

## Temuan Audit PWA Terlampir

| Temuan | Bukti dalam berkas terlampir | Dampak |
|---|---|---|
| Manifest tidak ditautkan ke halaman | Bagian `<head>` `index.html` hanya memuat font dan `styles.css`; tidak ada `<link rel="manifest">`. | Browser tidak menemukan metadata PWA untuk menawarkan instalasi. |
| Service worker tidak didaftarkan | `index.html` hanya memuat `app.js`; tidak ada pemanggilan `navigator.serviceWorker.register(...)`. | `sw.js` tidak pernah dijalankan sehingga aplikasi tidak mendapat cache offline. |
| Nama cache tidak didefinisikan | `sw.js` memakai `caches.open(CACHE)` tetapi tidak mendeklarasikan konstanta `CACHE`. | Instalasi service worker akan gagal dengan kesalahan runtime. |
| Nama stylesheet salah dalam daftar cache | `sw.js` mencache `style.jss`, sementara halaman memakai `styles.css`. | `cache.addAll()` gagal dan mencegah instalasi service worker. |
| Jalur PWA terkunci pada subdirektori tertentu | `manifest.json` dan `sw.js` memakai `/ruang_tumbuh/...`. | Jika nama repo atau jalur GitHub Pages berbeda, berkas penting tidak ditemukan. |
| Jalur ikon dan nama berkas tidak konsisten | Manifest menyebut `ruang tumbuh icons.png`, sedangkan lampiran bernama `ruangtumbuhicons.png`. | Ikon manifest dapat gagal dimuat. |
| Ikon instalasi belum lengkap | Manifest hanya mendeklarasikan ikon 192×192. | Dukungan instalasi lintas perangkat menjadi kurang andal; sediakan paling tidak ikon 192×192 dan 512×512. |
| Penyimpanan hanya bergantung pada browser | Aplikasi lama menggunakan `localStorage`. | Data bergantung pada profil browser; cache atau data situs yang dihapus dapat menghilangkan catatan. |

> **Penyebab paling langsung:** browser tidak diberi tautan manifest maupun perintah mendaftarkan service worker. Kalaupun `sw.js` kemudian didaftarkan, ia masih gagal karena `CACHE` tidak ada dan `style.jss` salah eja.

## Perbaikan yang Diterapkan pada Versi Mobile

| Area | Implementasi baru |
|---|---|
| Instalasi | Proyek Expo dapat dibangun menjadi paket aplikasi Android/iOS melalui alur Publish. |
| Offline | Refleksi, latihan, check-in, rutinitas, catatan makan, dan tinjauan menggunakan penyimpanan lokal perangkat. |
| Privasi | Tidak ada akun atau sinkronisasi server yang dipersyaratkan untuk fungsi inti. |
| Cadangan | Data dapat dibagikan sebagai JSON melalui menu sistem dan dipulihkan dengan menempelkan JSON cadangan. |
| Branding | Ikon khusus Ruang Tumbuh telah ditempatkan pada icon, splash, favicon, dan adaptive-icon Android. |
| Pengujian | Terdapat pengujian unit untuk normalisasi cadangan, rutinitas lokal, perhitungan makanan, dan tinjauan mingguan. |

## Cara Menguji dan Memasang pada Smartphone

Pertama, buka kartu proyek dan gunakan **Preview** untuk melihat antarmuka web. Untuk menguji perilaku aplikasi native, pindai QR di panel proyek dengan Expo Go pada smartphone. Lakukan minimal satu alur lengkap: buat refleksi, tandai latihan, simpan check-in, tutup aplikasi, lalu buka kembali untuk memastikan data lokal tetap ada.

Setelah Anda puas dengan hasil uji, buat checkpoint terbaru lalu tekan tombol **Publish** pada antarmuka proyek. Proses Publish membangun paket aplikasi. Gunakan paket Android yang dihasilkan untuk pemasangan di perangkat Android. Untuk distribusi iOS publik, proses lanjutan melalui ekosistem Apple tetap diperlukan.

## Sinkronisasi GitHub

Kode sumber akan disimpan pada repositori GitHub privat agar perubahan dapat dilacak tanpa mengekspos catatan pengguna atau konfigurasi lokal. Setelah repositori tersedia, alur perubahan yang disarankan adalah memperbarui proyek, menjalankan test dan lint, membuat commit, lalu mendorong perubahan ke cabang utama. Jangan menyimpan cadangan jurnal nyata atau rahasia di dalam repository.

## Jika Tetap Memilih PWA Lama

PWA lama dapat diperbaiki, tetapi hasilnya tetap aplikasi browser, bukan APK. Minimal tambahkan tautan manifest, pendaftaran service worker, konstanta nama cache, daftar aset yang benar, ikon 192×192 dan 512×512, serta gunakan jalur relatif yang cocok dengan GitHub Pages. Kemudian aktifkan GitHub Pages atau host HTTPS lain dan gunakan menu **Add to Home Screen** di browser smartphone.
