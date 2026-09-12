@web @admin
Feature: Modul 3 - Manajemen & Filter Pengguna Admin (ADMIN_USERS)

  Background:
    Given Pengguna telah login sebagai Admin dan berada di dashboard

  @Auto-Critical @Low-Complexity @WEB-ADM-NAV-POS-016
  Scenario: WEB-ADM-NAV-POS-016 Verifikasi navigasi ke modul Admin via menu sidebar
    When Pengguna mengklik menu "Admin" pada sidebar navigasi
    Then Browser berpindah ke halaman System Users "/web/index.php/admin/viewSystemUsers"
    And Header breadcrumb menampilkan "Admin" dan form filter pengguna siap digunakan

  @Auto-Critical @Medium-Complexity @WEB-ADM-SRCH-POS-017
  Scenario: WEB-ADM-SRCH-POS-017 Verifikasi pencarian data pengguna dengan Username "Admin" pada modul Admin
    Given Pengguna berada di halaman filter System Users
    When Pengguna mencari pengguna dengan username "Admin"
    Then Label counter record menampilkan minimal "1" record ditemukan
    And Baris data pada tabel menampilkan username "Admin"

  @Auto-Normal @Medium-Complexity @WEB-ADM-PART-BVA-018 @skip
  Scenario: WEB-ADM-PART-BVA-018 Verifikasi pencarian pengguna dengan substring atau prefix username "Adm"
    Given Pengguna berada di halaman filter System Users
    When Pengguna mencari pengguna dengan username "Adm"
    Then Tabel memuat dan menampilkan record pengguna yang mengandung "Adm"

  @Auto-High @Medium-Complexity @WEB-ADM-NREC-NEG-019
  Scenario: WEB-ADM-NREC-NEG-019 Verifikasi pencarian dengan username yang tidak ada di database
    Given Pengguna berada di halaman filter System Users
    When Pengguna mencari pengguna dengan username "NonExistentUser999"
    Then Muncul pesan atau counter "No Records Found"
    And Tabel tidak menampilkan baris data apapun

  @Auto-High @Medium-Complexity @WEB-ADM-RST-POS-021
  Scenario: WEB-ADM-RST-POS-021 Verifikasi fungsionalitas tombol Reset pada form pencarian System Users
    Given Pengguna berada di halaman filter System Users
    And Pengguna telah melakukan pencarian username "Admin"
    When Pengguna mengklik tombol Reset pada form filter
    Then Input field Username kembali kosong
    And Tabel memuat ulang dan menampilkan seluruh record pengguna sistem
