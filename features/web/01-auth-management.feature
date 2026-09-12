@web @auth
Feature: Modul 1 - Manajemen Autentikasi & Sesi (AUTH_MGMT)

  Background:
    Given Pengguna berada di halaman login OrangeHRM

  @Auto-Critical @Low-Complexity @WEB-AUTH-LOGN-POS-001
  Scenario: WEB-AUTH-LOGN-POS-001 Verifikasi login berhasil menggunakan kredensial Admin valid
    When Pengguna memasukkan "Admin" pada input field Username
    And Pengguna memasukkan "admin123" pada input field Password
    And Pengguna mengklik tombol "Login"
    Then Browser berhasil dialihkan ke URL Dashboard "/web/index.php/dashboard/index"
    And Header menampilkan nama profil pengguna dan sidebar menu navigasi ditampilkan lengkap

  @Auto-High @Low-Complexity @WEB-AUTH-INVP-NEG-002
  Scenario: WEB-AUTH-INVP-NEG-002 Verifikasi penolakan login dengan password yang salah
    When Pengguna memasukkan "Admin" pada input field Username
    And Pengguna memasukkan "wrongpassword999" pada input field Password
    And Pengguna mengklik tombol "Login"
    Then URL browser tetap berada di "/web/index.php/auth/login"
    And Muncul banner alert merah dengan pesan "Invalid credentials"

  @Auto-High @Low-Complexity @WEB-AUTH-INVU-NEG-003
  Scenario: WEB-AUTH-INVU-NEG-003 Verifikasi penolakan login dengan username yang tidak terdaftar
    When Pengguna memasukkan "GhostUser999" pada input field Username
    And Pengguna memasukkan "admin123" pada input field Password
    And Pengguna mengklik tombol "Login"
    Then URL browser tetap berada di "/web/index.php/auth/login"
    And Muncul banner alert merah dengan pesan "Invalid credentials"

  @Auto-High @Low-Complexity @WEB-AUTH-EMPU-NEG-004
  Scenario: WEB-AUTH-EMPU-NEG-004 Verifikasi validasi form jika field Username dikosongkan
    When Pengguna mengosongkan input field Username
    And Pengguna memasukkan "admin123" pada input field Password
    And Pengguna mengklik tombol "Login"
    Then Form submission diblokir dan URL tetap "/web/index.php/auth/login"
    And Di bawah input field Username muncul teks label error "Required"
    And Border input field Username berubah warna menjadi merah

  @Auto-High @Low-Complexity @WEB-AUTH-EMPP-NEG-005
  Scenario: WEB-AUTH-EMPP-NEG-005 Verifikasi validasi form jika field Password dikosongkan
    When Pengguna memasukkan "Admin" pada input field Username
    And Pengguna mengosongkan input field Password
    And Pengguna mengklik tombol "Login"
    Then Form submission diblokir dan URL tetap "/web/index.php/auth/login"
    And Di bawah input field Password muncul teks label error "Required"
    And Border input field Password berubah warna menjadi merah

  @Auto-High @Low-Complexity @WEB-AUTH-EMPB-NEG-006
  Scenario: WEB-AUTH-EMPB-NEG-006 Verifikasi validasi form jika kedua field login dikosongkan
    When Pengguna langsung mengklik tombol "Login" tanpa mengisi field apapun
    Then Form submission diblokir dan URL tetap "/web/index.php/auth/login"
    And Di bawah input field Username muncul teks label error "Required"
    And Di bawah input field Password muncul teks label error "Required"

  @Auto-Normal @Low-Complexity @WEB-AUTH-MASK-SEC-007
  Scenario: WEB-AUTH-MASK-SEC-007 Verifikasi keamanan penyamaran teks input pada field Password
    When Pengguna memasukkan "admin123" pada input field Password
    Then Karakter password pada field Password tersamar dengan atribut type bernilai "password"

  @Auto-Critical @Low-Complexity @WEB-AUTH-LOUT-POS-009
  Scenario: WEB-AUTH-LOUT-POS-009 Verifikasi alur logout pengguna melalui header profile dropdown
    When Pengguna memasukkan "Admin" pada input field Username
    And Pengguna memasukkan "admin123" pada input field Password
    And Pengguna mengklik tombol "Login"
    And Pengguna membuka menu dropdown profil pengguna
    And Pengguna mengklik tautan "Logout"
    Then Browser berhasil dialihkan kembali ke URL Login "/web/index.php/auth/login"
    And Form login ditampilkan bersih dan siap menerima input baru

  @Auto-Critical @Medium-Complexity @WEB-AUTH-BACK-SEC-010
  Scenario: WEB-AUTH-BACK-SEC-010 Verifikasi proteksi tombol Back browser setelah logout berhasil
    When Pengguna memasukkan "Admin" pada input field Username
    And Pengguna memasukkan "admin123" pada input field Password
    And Pengguna mengklik tombol "Login"
    And Pengguna membuka menu dropdown profil pengguna
    And Pengguna mengklik tautan "Logout"
    And Pengguna menekan tombol "Back" pada browser
    Then Sistem secara otomatis memaksa redirect kembali ke "/web/index.php/auth/login"
