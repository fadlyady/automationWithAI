@web @sidebar
Feature: Modul 2 - Filter Navigasi Panel Samping (NAV_SIDEBAR)

  Background:
    Given Pengguna telah login sebagai Admin dan berada di dashboard

  @Auto-High @Low-Complexity @WEB-NAV-SRCH-POS-012
  Scenario: WEB-NAV-SRCH-POS-012 Verifikasi live filter menu sidebar dengan kata kunci "Admin"
    When Pengguna mengetikkan "Admin" pada input search sidebar
    Then Hanya menu "Admin" yang tampil pada panel sidebar
    And Menu navigasi lainnya disembunyikan secara otomatis

  @Auto-Normal @Low-Complexity @WEB-NAV-CASE-BVA-013
  Scenario: WEB-NAV-CASE-BVA-013 Verifikasi sifat case-insensitive pada fitur filter menu sidebar
    When Pengguna mengetikkan "admin" pada input search sidebar
    Then Menu "Admin" berhasil difilter dan tampil pada sidebar
    When Pengguna membersihkan input search sidebar
    And Pengguna mengetikkan "ADMIN" pada input search sidebar
    Then Menu "Admin" berhasil difilter dan tampil pada sidebar

  @Auto-High @Low-Complexity @WEB-NAV-CLER-POS-014
  Scenario: WEB-NAV-CLER-POS-014 Verifikasi pemulihan seluruh menu sidebar saat input pencarian dihapus
    Given Pengguna sedang memfilter sidebar dengan kata kunci "Admin"
    When Pengguna membersihkan input search sidebar
    Then Seluruh 12 item menu sidebar kembali ditampilkan secara lengkap

  @Auto-Normal @Low-Complexity @WEB-NAV-NMAT-NEG-015
  Scenario: WEB-NAV-NMAT-NEG-015 Verifikasi perilaku sidebar jika kata kunci pencarian tidak ditemukan
    When Pengguna mengetikkan "xyz987" pada input search sidebar
    Then Tidak ada item menu navigasi yang ditampilkan pada panel sidebar
