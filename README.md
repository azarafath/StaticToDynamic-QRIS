# QRIS Converter

QRIS Converter adalah aplikasi berbasis React yang memungkinkan pengguna untuk membuat **kode QRIS** dengan data statis dan kemampuan untuk menambahkan biaya tambahan (fee) dalam bentuk **nilai tetap** atau **persentase**.


# Demo
https://qr.azf.my.id/
---

## Fitur Utama
1. **Input Jumlah Tagihan**  
   Pengguna dapat memasukkan jumlah tagihan yang akan dibayar.

2. **Opsi Penambahan Fee (Biaya Tambahan)**  
   - Fee dapat berupa *nilai tetap* (Rupiah) atau *persentase* dari total tagihan.
   - Jika fee diaktifkan, sistem akan otomatis menghitung total tagihan.

3. **Konversi Kode QR**  
   - Aplikasi akan memodifikasi QRIS statis berdasarkan input pengguna (jumlah dan fee).
   - QR code hasil konversi akan ditampilkan dan divisualisasikan di canvas.

4. **Dark Mode Toggle**  
   Aplikasi mendukung **perubahan tema** antara mode terang dan gelap.

5. **Reset Form dan QR Code**  
   Pengguna dapat kembali ke form untuk mengubah input dengan menekan tombol **Back**.

---

## Instalasi dan Setup

Pastikan Anda sudah memiliki **Node.js** dan **npm** terinstal di perangkat Anda.

1. Clone repository ini ke perangkat lokal Anda:
   ```bash
   git clone <repository-url>
   cd qris-converter
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

4. Buka browser dan akses:
   ```
   http://localhost:3000
   ```

---

## Cara Mengubah **Static QRIS**

Agar aplikasi dapat menggunakan QRIS Anda, ganti nilai variabel **`qrisStatic`** di dalam kode dengan QRIS statis Anda sendiri.

```javascript
// Ubah nilai di sini dengan QRIS statis Anda
const qrisStatic = "00020101021126570011ID.DANA.WWW011893600915336094826302093609482630303UMI51440014ID.CO.QRIS.WWW0215ID10222329023150303UMI5204737253033605802ID5922Ahmad Zakaria Fathoni 6013Kota Semarang61055021863045D82";
```

**Petunjuk**:
1. Salin kode QRIS statis Anda (dari bank atau aplikasi QRIS resmi).  
2. Ganti string di variabel `qrisStatic` dengan kode Anda.  
3. Pastikan format kode QRIS sesuai agar aplikasi dapat memprosesnya dengan benar.  

---

## Cara Penggunaan

1. **Input Tagihan**  
   Masukkan jumlah tagihan di kolom **Amount**.

2. **Opsi Fee**  
   Jika ingin menambahkan biaya tambahan, centang opsi **Termasuk Fee?** dan pilih tipe fee:  
   - **Fixed**: Biaya dalam rupiah.  
   - **Percentage**: Biaya dalam bentuk persentase dari jumlah tagihan.

3. **Konversi QRIS**  
   Klik tombol **Konversi** untuk menghasilkan kode QR.

4. **QR Code & Total Tagihan**  
   Setelah QR code muncul, Anda akan melihat total tagihan yang sudah termasuk fee (jika ada).  

5. **Reset Data**  
   Klik **Back** untuk kembali dan melakukan input ulang.

---

## Tampilan UI

- **Tema Gradien**: Latar belakang halaman menggunakan **gradien warna ungu hingga merah**, dengan opsi untuk dark mode.
- **Animasi & Transisi**: Komponen UI dilengkapi dengan animasi untuk peningkatan UX.
- **Canvas QR Code**: QR code digambar di dalam elemen **canvas** untuk menjaga kualitas tampilan.

---

## Dependensi

- **React**: Library utama untuk membangun UI.
- **Next.js Themes**: Mengelola tema light/dark mode.
- **QRCode**: Library untuk menghasilkan kode QR dalam format **canvas** dan **dataURL**.
- **Lucide React**: Menyediakan ikon tema (Moon dan Sun).

