## Sistem Antrian Presentasi Kelas

Aplikasi ini adalah sistem antrian presentasi berbasis web untuk beberapa kelas
(X/XI RPL, TKJ, DKV). Terdapat dua sisi utama:

- **Admin / Guru** – mengatur giliran presentasi dan reset antrian per kelas.
- **Display / Siswa** – menampilkan informasi giliran presentasi dan siswa observasi
  secara realtime, bisa ditampilkan di proyektor/TV atau perangkat siswa.

Aplikasi dibangun dengan:

- [Next.js 16](https://nextjs.org) (App Router)
- Firebase Authentication (Email/Password)
- Cloud Firestore (realtime antrian per kelas)
- Tailwind CSS + komponen ala shadcn + ikon lucide-react
- Web Speech API (opsional) untuk pengumuman suara pemanggilan siswa

## Menjalankan Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Konfigurasi Firebase

1. Buat project di Firebase Console.
2. Tambahkan aplikasi Web dan ambil konfigurasi `firebaseConfig`.
3. Aktifkan:
   - Authentication → Sign-in method → Email/Password.
   - Firestore Database.
4. Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

5. Di Firebase Authentication, buat akun admin (guru) dengan email/password.

## Routing Penting

- `/` – halaman landing, berisi daftar kelas untuk display (X/XI RPL, TKJ, DKV).
- `/kelas/[queueId]` – display antrian per kelas (untuk siswa / layar TV).
  - Contoh: `/kelas/x-rpl`, `/kelas/xi-tkj`, `/kelas/x-dkv`, dll.
- `/admin` – dashboard admin, memilih kelas setelah login.
- `/admin/[queueId]` – panel admin untuk kelas tertentu (Next/Reset antrian).
  - Contoh: `/admin/x-rpl`, `/admin/xi-tkj`, `/admin/x-dkv`, dll.

## Cara Kerja Antrian

- Setiap kelas memiliki dokumen antrian sendiri di koleksi Firestore `queues`.
- Data awal siswa per kelas (termasuk pasangan observer) didefinisikan di `lib/queue.ts`.
- Admin:
  - Menekan **Next Giliran** untuk memindahkan giliran presentasi (loop kembali ke awal).
  - Menekan **Reset Antrian ke Awal** untuk mengembalikan antrian ke data awal di `lib/queue.ts`.
- Display:
  - Halaman `/kelas/[queueId]` mendengarkan perubahan dokumen Firestore dan
    menampilkan:
    - 1 siswa yang sedang presentasi (nama besar di tengah).
    - 2 siswa sebagai observer.
  - Opsional: memutar suara pemanggilan menggunakan Web Speech API.

## Catatan

- Untuk menyesuaikan daftar siswa per kelas atau pasangan observer, ubah
  konfigurasi di `lib/queue.ts` lalu gunakan tombol **Reset Antrian ke Awal**
  di panel admin kelas terkait agar Firestore terisi ulang dengan data terbaru.
