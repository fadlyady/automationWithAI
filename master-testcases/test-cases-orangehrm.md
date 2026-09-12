# Automation & QA Master Test Case Suite: OrangeHRM Web App

Dokumen ini berisi seluruh skenario pengujian komprehensif (*Master Test Case Suite*) yang diturunkan langsung dari [PRD_Analysis_OrangeHRM.md](file:///Users/fadlyady/Documents/Eldo%20Work/prdAnalyzer/result-testcase/PRD_Analysis_OrangeHRM.md) dan [PRD_Sederhana_OrangeHRM.md](file:///Users/fadlyady/Documents/Eldo%20Work/prdAnalyzer/result-testcase/PRD_Sederhana_OrangeHRM.md). Format disusun dengan standar industri **Layered Pragmatic BDD (Gherkin untuk UI/E2E & Structured AAA untuk Backend/API)**, **Cakupan 3-Tier Matrix**, dan **Triple-Layer Assertions (UI + API Contract + Data Persistence)**.

Spreadsheet Master Excel 15-Kolom tersedia di:  
📊 [Test_Cases_OrangeHRM.xlsx](file:///Users/fadlyady/Documents/Eldo%20Work/prdAnalyzer/result-testcase/Test_Cases_OrangeHRM.xlsx)

---

## 📊 Ringkasan Distribusi Test Case

| Kategori Pengujian | P1 (Critical) | P2 (High) | P3 (Normal/Low) | Total |
| :--- | :---: | :---: | :---: | :---: |
| **Tier 1: Happy Path (Golden Journey)** | 3 | 3 | 0 | **6** |
| **Tier 2: Boundary, Negative, Security & Concurrency** | 4 | 8 | 3 | **15** |
| **Tier 3: Heuristic Exploratory Testing Charters** | 2 | 2 | 0 | **4** |
| **TOTAL KESELURUHAN** | **9** | **13** | **3** | **25** |

---

## Modul 1: Manajemen Autentikasi & Sesi (AUTH_MGMT)

### WEB-AUTH-LOGN-POS-001: Verifikasi login berhasil menggunakan kredensial Admin valid `[Auto-Critical]` `[Low-Complexity]`
- **User Story**: [Priority: Critical] US-01: Autentikasi Pengguna (Login) (Covers: AC-01.1)
- **Tipe**: Functional / Positive
- **Precondition**:
  1. Browser terbuka pada URL login: `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`.
  2. Akun pengguna Admin aktif dengan status Enabled.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di halaman login OrangeHRM (`/web/index.php/auth/login`).
  - **When**: 
    1. Pengguna memasukkan `"Admin"` pada input field Username (`input[name="username"]`).
    2. Pengguna memasukkan `"admin123"` pada input field Password (`input[name="password"]`).
    3. Pengguna mengklik tombol `"Login"` (`button[type="submit"]`).
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Browser berhasil dialihkan ke URL Dashboard (`/web/index.php/dashboard/index`).
    2. Header menampilkan nama profil pengguna dan sidebar menu navigasi ditampilkan lengkap.
  - **And (API & DB)**: 
    3. [API] Request `POST /web/index.php/auth/validate` merespons HTTP `302 Found` (redirect ke dashboard).
    4. [DB/Session] Set-Cookie header menerbitkan cookie `orangehrm` dengan atribut `HttpOnly`, `Secure`, dan `SameSite=Lax`.

---

### WEB-AUTH-INVP-NEG-002: Verifikasi penolakan login dengan password yang salah `[Auto-High]` `[Low-Complexity]`
- **User Story**: [Priority: Critical] US-01: Autentikasi Pengguna (Login) (Covers: AC-01.2)
- **Tipe**: Negative / Security
- **Precondition**:
  1. Browser berada pada halaman login `/web/index.php/auth/login`.
  2. Username `"Admin"` terdaftar di sistem.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di halaman login OrangeHRM.
  - **When**: 
    1. Pengguna memasukkan `"Admin"` pada field Username.
    2. Pengguna memasukkan password yang salah `"wrongpassword999"` pada field Password.
    3. Pengguna mengklik tombol `"Login"`.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. URL browser tetap berada di `/web/index.php/auth/login`.
    2. Muncul banner alert merah (`.oxd-alert--error`) dengan pesan `"Invalid credentials"`.
    3. Input password dikosongkan kembali untuk input ulang.
  - **And (API & DB)**: 
    4. [API] Request `POST /web/index.php/auth/validate` menolak otentikasi.
    5. [DB/Session] Tidak ada sesi login aktif baru yang diizinkan mengakses resource terproteksi.

---

### WEB-AUTH-INVU-NEG-003: Verifikasi penolakan login dengan username yang tidak terdaftar `[Auto-High]` `[Low-Complexity]`
- **User Story**: [Priority: Critical] US-01: Autentikasi Pengguna (Login) (Covers: AC-01.2)
- **Tipe**: Negative / Security
- **Precondition**:
  1. Browser berada pada halaman login `/web/index.php/auth/login`.
  2. Akun `"GhostUser999"` tidak terdaftar di database.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di halaman login OrangeHRM.
  - **When**: 
    1. Pengguna memasukkan `"GhostUser999"` pada field Username.
    2. Pengguna memasukkan `"admin123"` pada field Password.
    3. Pengguna mengklik tombol `"Login"`.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Alert error merah (`.oxd-alert--error`) muncul dengan teks `"Invalid credentials"`.
    2. Pengguna tidak dialihkan ke halaman dashboard.
  - **And (API & DB)**: 
    3. [API] Request `POST /web/index.php/auth/validate` gagal dan tidak membocorkan informasi status eksistensi user (mencegah *user enumeration*).

---

### WEB-AUTH-EMPU-NEG-004: Verifikasi validasi form jika field Username dikosongkan `[Auto-High]` `[Low-Complexity]`
- **User Story**: [Priority: Critical] US-01: Autentikasi Pengguna (Login) (Covers: AC-01.3)
- **Tipe**: Negative / Validation
- **Precondition**:
  1. Halaman login terbuka dan kedua field dalam kondisi kosong.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di form login dengan field Username kosong.
  - **When**: 
    1. Pengguna membiarkan field Username kosong (`""`).
    2. Pengguna memasukkan `"admin123"` pada field Password.
    3. Pengguna mengklik tombol `"Login"`.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Tidak terjadi pengalihan halaman; form submission diblokir di sisi client.
    2. Di bawah input field Username muncul teks label error warna merah `"Required"`.
    3. Border input field Username berubah warna menjadi merah (`oxd-input--error`).
  - **And (API)**: 
    4. [API] Tidak ada request HTTP network `POST /auth/validate` yang dikirim ke server.

---

### WEB-AUTH-EMPP-NEG-005: Verifikasi validasi form jika field Password dikosongkan `[Auto-High]` `[Low-Complexity]`
- **User Story**: [Priority: Critical] US-01: Autentikasi Pengguna (Login) (Covers: AC-01.3)
- **Tipe**: Negative / Validation
- **Precondition**:
  1. Halaman login terbuka dan form bersih.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di form login.
  - **When**: 
    1. Pengguna memasukkan `"Admin"` pada field Username.
    2. Pengguna membiarkan field Password kosong (`""`).
    3. Pengguna mengklik tombol `"Login"`.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Form submission dibatalkan di browser; URL tetap `/web/index.php/auth/login`.
    2. Di bawah field Password muncul pesan validasi teks merah `"Required"`.
    3. Border input field Password berganti menjadi warna merah.
  - **And (API)**: 
    4. [API] Tidak ada request jaringan POST yang ditembakkan ke backend.

---

### WEB-AUTH-EMPB-NEG-006: Verifikasi validasi form jika kedua field login dikosongkan `[Auto-High]` `[Low-Complexity]`
- **User Story**: [Priority: Critical] US-01: Autentikasi Pengguna (Login) (Covers: AC-01.3)
- **Tipe**: Negative / Validation
- **Precondition**:
  1. Halaman login aktif tanpa input apa pun.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Form login dalam keadaan kosong seutuhnya.
  - **When**: 
    1. Pengguna langsung mengklik tombol `"Login"` tanpa mengisi field apa pun.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Pesan validasi teks merah `"Required"` muncul secara serentak di bawah field Username dan field Password.
    2. Kedua input field memiliki class visual border merah.
  - **And (API)**: 
    3. [API] Request dicegat sepenuhnya di sisi client-side validation.

---

### WEB-AUTH-MASK-SEC-007: Verifikasi keamanan penyamaran teks input pada field Password `[Auto-Normal]` `[Low-Complexity]`
- **User Story**: [Priority: Critical] US-01: Autentikasi Pengguna (Login) (Covers: AC-01.4)
- **Tipe**: Security / UI
- **Precondition**:
  1. Halaman login `/web/index.php/auth/login` aktif.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di form login.
  - **When**: 
    1. Pengguna mengetikkan `"admin123"` pada field input Password.
    2. Melakukan inspeksi atribut elemen DOM pada input password.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Karakter password yang tampil di layar berupa titik/bulatan tersamar (*masked characters*).
    2. Atribut HTML elemen terkonfirmasi `type="password"`.

---

### API-AUTH-CSRF-SEC-008: Verifikasi validasi proteksi CSRF Token pada endpoint autentikasi `[Auto-High]` `[Medium-Complexity]`
- **User Story**: [Priority: Critical] US-01: Autentikasi Pengguna (Login) (Covers: AC-01.1)
- **Tipe**: Security / API
- **Precondition**:
  1. Akses API endpoint login `/web/index.php/auth/validate`.
- **Test Steps (Structured AAA)**:
  - **Arrange**: Siapkan payload POST tanpa parameter `_token` atau dengan token CSRF fiktif/manipulasi: `{"username": "Admin", "password": "admin123"}`.
  - **Act**: Kirim request `POST /web/index.php/auth/validate` dengan payload tersebut.
  - **Assert**: Evaluasi HTTP status code dan respon proteksi CSRF dari backend server.
- **Expected Results (Triple-Layer Assertions)**:
  - 1. [API] Server menolak request otentikasi (mengembalikan redirect login tanpa cookie sesi atau HTTP `419 Page Expired`).
  - 2. [DB/Session] Tidak ada sesi aktif baru yang terdaftar di server.

---

### WEB-AUTH-LOUT-POS-009: Verifikasi alur logout pengguna melalui header profile dropdown `[Auto-Critical]` `[Low-Complexity]`
- **User Story**: [Priority: Critical] US-05: Logout Akun (Logout) (Covers: AC-05.1, AC-05.2)
- **Tipe**: Functional / Positive
- **Precondition**:
  1. Pengguna telah login sebagai Admin dan berada pada dashboard utama.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di halaman dashboard terotentikasi.
  - **When**: 
    1. Pengguna mengklik tab profil pengguna di pojok kanan atas (`.oxd-userdropdown-tab`).
    2. Menu dropdown terbuka menampilkan 4 item: About, Support, Change Password, Logout.
    3. Pengguna mengklik tautan `"Logout"` (`.oxd-userdropdown-link[href*="logout"]`).
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Browser diarahkan kembali ke URL Login (`/web/index.php/auth/login`).
    2. Tampilan antarmuka login muncul dalam keadaan bersih dan siap menerima input baru.
  - **And (API & DB)**: 
    3. [API] Request `GET /web/index.php/auth/logout` merespons HTTP `302 Found`.
    4. [DB/Session] Cookie sesi `orangehrm` di server di-destroy dan dihapus dari storage browser.

---

### WEB-AUTH-BACK-SEC-010: Verifikasi proteksi tombol Back browser setelah logout berhasil `[Auto-Critical]` `[Medium-Complexity]`
- **User Story**: [Priority: Critical] US-05: Logout Akun (Logout) (Covers: AC-05.3)
- **Tipe**: Security / Browser Lifecycle
- **Precondition**:
  1. Pengguna baru saja berhasil melakukan logout dan saat ini berada di halaman login `/web/index.php/auth/login`.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna telah keluar dari sistem dan berada di halaman login.
  - **When**: 
    1. Pengguna menekan tombol "Back" (kembali) pada browser history.
    2. Mengamati respon navigasi dan state otentikasi.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Pengguna dilarang mengakses halaman Dashboard ataupun modul internal.
    2. Sistem secara otomatis memaksa redirect kembali ke `/web/index.php/auth/login`.
  - **And (API)**: 
    3. [API] Request AJAX terproteksi gagal memvalidasi sesi dan merespons `401 Unauthorized` / `302 Redirect`.

---

### API-AUTH-SESS-SEC-011: Verifikasi pemblokiran akses API terproteksi setelah cookie sesi dihapus `[Auto-Critical]` `[Medium-Complexity]`
- **User Story**: [Priority: Critical] US-05: Logout Akun (Logout) (Covers: AC-05.2)
- **Tipe**: Security / RBAC
- **Precondition**:
  1. Sesi pengguna telah diterminasi melalui alur logout.
- **Test Steps (Structured AAA)**:
  - **Arrange**: Siapkan request HTTP `GET /web/index.php/api/v2/admin/users` tanpa menyertakan cookie `orangehrm` yang valid.
  - **Act**: Kirim request GET ke endpoint tersebut.
  - **Assert**: Evaluasi respon status code dan payload dari server.
- **Expected Results (Triple-Layer Assertions)**:
  - 1. [API] Server merespons dengan HTTP `401 Unauthorized` atau HTTP `302 Found` redirect ke login.
  - 2. [DB] Data pengguna sistem tidak dibocorkan kepada request tanpa otentikasi valid.

---

## Modul 2: Filter Navigasi Panel Samping (NAV_SIDEBAR)

### WEB-NAV-SRCH-POS-012: Verifikasi live filter menu sidebar dengan kata kunci "Admin" `[Auto-High]` `[Low-Complexity]`
- **User Story**: [Priority: High] US-02: Pencarian Menu Navigasi Sidebar (Covers: AC-02.1)
- **Tipe**: Functional / Positive
- **Precondition**:
  1. Pengguna telah login dan berada di Dashboard.
  2. Panel navigasi sidebar sebelah kiri dalam kondisi terbuka.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di dashboard dengan 12 menu sidebar ditampilkan lengkap.
  - **When**: 
    1. Pengguna mencari elemen input search pada sidebar (`.oxd-sidepanel .oxd-input`).
    2. Pengguna mengetikkan teks `"Admin"` pada input field tersebut.
    3. Mengamati pembaruan daftar menu pada `ul.oxd-main-menu`.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Hanya 1 item menu yang terlihat di sidebar, yaitu menu bertuliskan `"Admin"`.
    2. 11 menu lainnya (PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Maintenance, Claim, Buzz) otomatis disembunyikan.
    3. Penyaringan berlangsung instan di sisi client-side DOM tanpa reload halaman.

---

### WEB-NAV-CASE-BVA-013: Verifikasi sifat case-insensitive pada fitur filter menu sidebar `[Auto-Normal]` `[Low-Complexity]`
- **User Story**: [Priority: High] US-02: Pencarian Menu Navigasi Sidebar (Covers: AC-02.1)
- **Tipe**: Boundary / Usability
- **Precondition**:
  1. Pengguna berada pada dashboard dengan panel sidebar aktif.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Panel navigasi samping aktif.
  - **When**: 
    1. Pengguna mengetikkan `"admin"` (seluruhnya huruf kecil) pada input search sidebar.
    2. Verifikasi menu yang tampil.
    3. Pengguna menghapus input dan mengetikkan `"ADMIN"` (seluruhnya huruf kapital).
    4. Verifikasi kembali menu yang tampil.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Pada kedua percobaan (`"admin"` dan `"ADMIN"`), menu `"Admin"` tetap berhasil difilter dan tampil.
    2. Menu lain yang tidak cocok tetap disembunyikan.

---

### WEB-NAV-CLER-POS-014: Verifikasi pemulihan seluruh menu sidebar saat input pencarian dihapus `[Auto-High]` `[Low-Complexity]`
- **User Story**: [Priority: High] US-02: Pencarian Menu Navigasi Sidebar (Covers: AC-02.2)
- **Tipe**: Functional / Positive
- **Precondition**:
  1. Input search sidebar sedang berisi teks filter `"Admin"` dan hanya menampilkan 1 menu.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Sidebar dalam kondisi tersaring oleh kata kunci `"Admin"`.
  - **When**: 
    1. Pengguna fokus pada input search sidebar.
    2. Pengguna menghapus seluruh teks menggunakan tombol backspace atau clear input.
    3. Mengamati daftar menu pada `ul.oxd-main-menu`.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Seluruh 12 item menu utama kembali tampil secara lengkap.
    2. Ikon dan teks menu navigasi tetap rapi dan berfungsi secara normal saat diklik.

---

### WEB-NAV-NMAT-NEG-015: Verifikasi perilaku sidebar jika kata kunci pencarian tidak ditemukan `[Auto-Normal]` `[Low-Complexity]`
- **User Story**: [Priority: High] US-02: Pencarian Menu Navigasi Sidebar (Covers: AC-02.3)
- **Tipe**: Negative / Usability
- **Precondition**:
  1. Pengguna berada di dashboard dengan panel sidebar aktif.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Panel sidebar menampilkan seluruh menu navigasi.
  - **When**: 
    1. Pengguna mengetikkan kata kunci acak `"xyz987"` pada input search sidebar.
    2. Mengamati daftar menu.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Tidak ada item menu navigasi yang ditampilkan pada panel sidebar (daftar menu kosong).
    2. Antarmuka tidak mengalami error atau tampilan rusak; input search tetap aktif menerima input perbaikan.

---

## Modul 3: Manajemen & Filter Pengguna Admin (ADMIN_USERS)

### WEB-ADM-NAV-POS-016: Verifikasi navigasi ke modul Admin via menu sidebar `[Auto-Critical]` `[Low-Complexity]`
- **User Story**: [Priority: Critical] US-03: Pencarian Data Pengguna pada Modul Admin (Covers: AC-03.1)
- **Tipe**: Functional / Positive
- **Precondition**:
  1. Pengguna login sebagai Admin dan berada pada dashboard utama.
  2. Menu `"Admin"` terlihat pada sidebar navigasi.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di halaman dashboard.
  - **When**: 
    1. Pengguna mengklik menu `"Admin"` pada sidebar kiri (`a.oxd-main-menu-item[href*="admin"]`).
    2. Menunggu transisi halaman selesai.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. URL berubah menjadi `/web/index.php/admin/viewSystemUsers`.
    2. Header breadcrumb menampilkan `"Admin / User Management"`.
    3. Form filter `"System Users"` dan tabel daftar pengguna dimuat dengan data default.
  - **And (API)**: 
    4. [API] Request `GET /web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC` merespons HTTP `200 OK`.

---

### WEB-ADM-SRCH-POS-017: Verifikasi pencarian data pengguna dengan Username "Admin" pada modul Admin `[Auto-Critical]` `[Medium-Complexity]`
- **User Story**: [Priority: Critical] US-03: Pencarian Data Pengguna pada Modul Admin (Covers: AC-03.2, AC-03.3)
- **Tipe**: Functional / Positive
- **Precondition**:
  1. Pengguna berada di halaman `/web/index.php/admin/viewSystemUsers`.
  2. Form filter System Users terlihat.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna berada di halaman filter System Users.
  - **When**: 
    1. Pengguna memasukkan teks `"Admin"` pada input field Username di form filter.
    2. Pengguna mengklik tombol `"Search"` (`button[type="submit"]`).
    3. Menunggu data tabel selesai dimuat.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Label counter record menampilkan `"(1) Record Found"`.
    2. Baris data pada tabel menampilkan Username `"Admin"`, User Role `"Admin"`, dan Status `"Enabled"`.
  - **And (API & DB)**: 
    3. [API] Request `GET /web/index.php/api/v2/admin/users?limit=50&offset=0&username=Admin&sortField=u.userName&sortOrder=ASC` merespons HTTP `200 OK` dengan payload `meta.total = 1`.
    4. [DB] Data yang dikembalikan sesuai dengan record user Admin di database.

---

### WEB-ADM-PART-BVA-018: Verifikasi pencarian pengguna dengan substring/prefix username "Adm" `[Auto-Normal]` `[Medium-Complexity]`
- **User Story**: [Priority: Critical] US-03: Pencarian Data Pengguna pada Modul Admin (Covers: AC-03.2)
- **Tipe**: Boundary / Filtering
- **Precondition**:
  1. Pengguna berada di halaman `/web/index.php/admin/viewSystemUsers`.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Form filter System Users aktif.
  - **When**: 
    1. Pengguna memasukkan teks `"Adm"` pada field input Username.
    2. Pengguna mengklik tombol `"Search"`.
    3. Mengamati data yang ditampilkan pada tabel.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Tabel memuat dan menampilkan record pengguna yang mengandung substring `"Adm"` (termasuk user `"Admin"`).
  - **And (API)**: 
    2. [API] Request `GET /api/v2/admin/users?username=Adm` berhasil merespons HTTP `200 OK` dengan record yang relevan.

---

### WEB-ADM-NREC-NEG-019: Verifikasi pencarian dengan username yang tidak ada di database `[Auto-High]` `[Medium-Complexity]`
- **User Story**: [Priority: Critical] US-03: Pencarian Data Pengguna pada Modul Admin (Covers: AC-03.4)
- **Tipe**: Negative / Empty State
- **Precondition**:
  1. Pengguna berada di halaman `/web/index.php/admin/viewSystemUsers`.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Form filter System Users aktif.
  - **When**: 
    1. Pengguna memasukkan teks `"NonExistentUser999"` pada input Username.
    2. Pengguna mengklik tombol `"Search"`.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Muncul toast info berwarna kuning atau label counter menampilkan `"No Records Found"`.
    2. Tabel tidak menampilkan baris data apapun (*empty state table*).
  - **And (API)**: 
    3. [API] Request API merespons HTTP `200 OK` dengan array data kosong `[]` dan `meta.total = 0`.

---

### API-ADM-FLTR-POS-020: Verifikasi query filter multi-parameter pada System Users REST API `[Auto-High]` `[Medium-Complexity]`
- **User Story**: [Priority: Critical] US-03: Pencarian Data Pengguna pada Modul Admin (Covers: AC-03.2)
- **Tipe**: Functional / API Integration
- **Precondition**:
  1. Sesi login Admin aktif dan memiliki cookie otentikasi valid.
- **Test Steps (Structured AAA)**:
  - **Arrange**: Siapkan request `GET /web/index.php/api/v2/admin/users` dengan parameter gabungan: `username=Admin&userRoleId=1`.
  - **Act**: Kirimkan request GET dengan menyertakan cookie sesi valid.
  - **Assert**: Verifikasi schema JSON, HTTP status code, dan konsistensi data record yang dikembalikan.
- **Expected Results (Triple-Layer Assertions)**:
  - 1. [API] Server merespons HTTP `200 OK`.
  - 2. [API] Objek record dalam `data[0]` memiliki `userName: "Admin"` dan `userRole.name: "Admin"`.
  - 3. [API] Properti `meta.total` bernilai `1`.

---

### WEB-ADM-RST-POS-021: Verifikasi fungsionalitas tombol Reset pada form pencarian System Users `[Auto-High]` `[Medium-Complexity]`
- **User Story**: [Priority: High] US-04: Reset Filter Pencarian (Covers: AC-04.1, AC-04.2, AC-04.3)
- **Tipe**: Functional / Positive
- **Precondition**:
  1. Pengguna telah melakukan pencarian Username=`"Admin"` dan tabel sedang menampilkan hasil filter (1 record).
- **Test Steps (Gherkin BDD)**:
  - **Given**: Form filter sedang aktif terisi nilai `"Admin"` dan tabel menampilkan 1 record hasil filter.
  - **When**: 
    1. Pengguna memastikan input Username masih berisi `"Admin"`.
    2. Pengguna mengklik tombol `"Reset"` (`button.oxd-button--ghost`) pada form filter.
    3. Mengamati pemulihan nilai field form dan pembaruan tabel data.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Input field Username kembali kosong (`""`).
    2. Dropdown User Role dan Status kembali ke opsi default (`-- Select --`).
    3. Tabel otomatis memuat ulang data dan menampilkan seluruh total record pengguna sistem (misal: `(50) Records Found`).
  - **And (API)**: 
    4. [API] Terjadi request otomatis `GET /web/index.php/api/v2/admin/users` tanpa menyertakan parameter `username`.

---

## Modul 4: Pengujian Eksploratif & Heuristik (EXPLORATORY)

### E2E-EXP-FEDX-EXP-022: The FedEx Tour: Melacak siklus hidup sesi dan mutasi cookie dari Login hingga Logout `[Auto-Critical]` `[High-Complexity]`
- **User Story**: [Priority: Critical] US-01 & US-05: E2E Session Lifecycle (Covers: AC-01.1, AC-05.2)
- **Tipe**: Exploratory / End-to-End
- **Precondition**:
  1. Browser baru dalam mode Incognito/Private tanpa cache dan cookie lama.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Browser bersih tanpa sesi tersimpan.
  - **When**: 
    1. Pengguna mengakses `/auth/login` dan memverifikasi token CSRF diterbitkan.
    2. Pengguna login dengan `Admin` / `admin123` dan memverifikasi cookie `orangehrm` tersimpan dengan flag `Secure` dan `HttpOnly`.
    3. Pengguna menyaring sidebar dengan kata kunci `"Admin"` lalu menavigasi ke modul Admin.
    4. Pengguna menjalankan pencarian Username `"Admin"` dan melakukan Reset.
    5. Pengguna melakukan Logout via profile dropdown.
    6. Memeriksa kembali tab Application / Cookies pada DevTools.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Seluruh transisi halaman, filter DOM, dan request AJAX berjalan tanpa error visual ataupun artefak yang rusak.
  - **And (API & DB)**: 
    2. [API/Session] Nilai cookie sesi terupdate dengan benar dan dihapus/invalidasi saat logout, sehingga token lama tidak dapat digunakan kembali.

---

### WEB-EXP-RUSH-EXP-023: The Rushed User Tour: Simulasi penekanan tombol Login dan Search secara cepat berulang `[Auto-High]` `[Medium-Complexity]`
- **User Story**: [Priority: High] US-01 & US-03: Concurrency & Idempotency (Covers: AC-01.1, AC-03.2)
- **Tipe**: Concurrency / Idempotency
- **Precondition**:
  1. Berada pada form login atau form pencarian System Users.
- **Test Steps (Gherkin BDD)**:
  - **Given**: Form input telah terisi kriteria valid.
  - **When**: 
    1. Pengguna melakukan klik beruntun sangat cepat (*double-click* dalam interval < 200ms) pada tombol `"Login"` atau tombol `"Search"`.
    2. Mengamati status tombol CTA dan log network request.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Tombol CTA mengalami disable sementara (*state loading*) untuk mencegah pengiriman transaksi ganda.
  - **And (API)**: 
    2. [API] Tidak ada error `500 Internal Server Error` atau unhandled promise rejection pada antarmuka.

---

### API-EXP-SABO-EXP-024: The Saboteur Tour: Injeksi payload karakter khusus dan SQLi pada parameter pencarian `[Auto-High]` `[High-Complexity]`
- **User Story**: [Priority: High] US-03: API Resiliency & Input Sanitization (Covers: AC-03.2)
- **Tipe**: Security / Chaos
- **Precondition**:
  1. Sesi pengguna Admin aktif.
- **Test Steps (Structured AAA)**:
  - **Arrange**: Siapkan variasi payload pencarian jahat:
    - Payload 1: `username="' OR '1'='1"` (SQL Injection attempt)
    - Payload 2: `username="<script>alert('XSS')</script>"` (Cross-Site Scripting attempt)
  - **Act**: Kirimkan request `GET /web/index.php/api/v2/admin/users` menggunakan kedua parameter tersebut secara bergantian.
  - **Assert**: Evaluasi respon server dan perilaku rendering antarmuka.
- **Expected Results (Triple-Layer Assertions)**:
  - 1. [API] Server merespons HTTP `200 OK` dengan hasil kosong atau `400 Bad Request` tanpa membocorkan seluruh data database (aman dari SQLi).
  - 2. [UI] Jika string diinput via form antarmuka web, karakter khusus dirender sebagai teks biasa (*HTML escaped*) dan tidak mengeksekusi script (bebas XSS).

---

### WEB-EXP-ROGU-EXP-025: The Rogue Tour: Akses URL langsung ke halaman terproteksi tanpa sesi autentikasi `[Auto-Critical]` `[Medium-Complexity]`
- **User Story**: [Priority: Critical] US-01 & US-03: Authorization Enforcement (Covers: AC-01.1, AC-03.1)
- **Tipe**: Security / Authorization
- **Precondition**:
  1. Browser bersih dari sesi aktif (guest unauthenticated).
- **Test Steps (Gherkin BDD)**:
  - **Given**: Pengguna belum melakukan login ke dalam sistem.
  - **When**: 
    1. Pengguna memasukkan langsung URL modul admin pada address bar browser:  
       `https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers`.
    2. Pengguna menekan tombol Enter.
- **Expected Results (Triple-Layer Assertions)**:
  - **Then (UI)**: 
    1. Halaman admin terproteksi tidak boleh ditampilkan sama sekali.
    2. Sistem secara instan mengarahkan pengguna kembali ke `/web/index.php/auth/login`.
  - **And (API)**: 
    3. [API] Request HTTP menghasilkan respon `302 Found` redirect ke halaman otentikasi login.
