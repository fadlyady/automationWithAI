@web @exploratory
Feature: Modul 4 - Pengujian Eksploratif & Heuristik UI (EXPLORATORY)

  @Auto-Critical @High-Complexity @E2E-EXP-FEDX-EXP-022
  Scenario: E2E-EXP-FEDX-EXP-022 The FedEx Tour: Melacak siklus hidup sesi dan mutasi navigasi dari Login hingga Logout
    Given Pengguna berada di halaman login OrangeHRM
    When Pengguna memasukkan "Admin" pada input field Username
    And Pengguna memasukkan "admin123" pada input field Password
    And Pengguna mengklik tombol "Login"
    Then Browser berhasil dialihkan ke URL Dashboard "/web/index.php/dashboard/index"
    When Pengguna mengetikkan "Admin" pada input search sidebar
    And Pengguna mengklik menu "Admin" pada sidebar navigasi
    Then Browser berpindah ke halaman System Users "/web/index.php/admin/viewSystemUsers"
    When Pengguna mencari pengguna dengan username "Admin"
    And Pengguna mengklik tombol Reset pada form filter
    And Pengguna membuka menu dropdown profil pengguna
    And Pengguna mengklik tautan "Logout"
    Then Browser berhasil dialihkan kembali ke URL Login "/web/index.php/auth/login"

  @Auto-High @Medium-Complexity @WEB-EXP-RUSH-EXP-023
  Scenario: WEB-EXP-RUSH-EXP-023 The Rushed User Tour: Simulasi penekanan tombol Login secara cepat berulang
    Given Pengguna berada di halaman login OrangeHRM
    When Pengguna memasukkan "Admin" pada input field Username
    And Pengguna memasukkan "admin123" pada input field Password
    And Pengguna mengklik tombol Login secara cepat berulang
    Then Browser tidak mengalami crash atau error visual dan berpindah ke dashboard

  @Auto-Critical @Medium-Complexity @WEB-EXP-ROGU-EXP-025
  Scenario: WEB-EXP-ROGU-EXP-025 The Rogue Tour: Akses URL langsung ke halaman terproteksi tanpa sesi autentikasi
    Given Pengguna belum melakukan login ke dalam sistem
    When Pengguna mengakses langsung URL terproteksi "/web/index.php/admin/viewSystemUsers"
    Then Sistem secara otomatis memaksa redirect kembali ke "/web/index.php/auth/login"
