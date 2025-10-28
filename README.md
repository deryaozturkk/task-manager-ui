# 🎨 Task Manager - UI (Frontend)

**[➡️ Canlı Uygulamayı Gör (Netlify)](https://task-managerui.netlify.app)**

Bu proje, Nest.JS API'sini tüketen, Rol Tabanlı Yetkilendirme (RBAC) özelliklerini yansıtan ve ileri düzey UX/UI prensiplerini kullanan bir **Angular 17 (Standalone Components)** arayüzüdür.

## 🛠️ Kullanılan Teknolojiler

* **Framework:** Angular 17 (Standalone Components)
* **UI/UX:** Angular Material (Cards, Buttons, Dialogs, Spinners, Select, Toolbar, List, Tooltip)
* **Routing:** Angular Router, Login Guard (`CanActivateFn`)
* **State:** Reactive Forms ile form yönetimi, Servisler ile basit durum yönetimi.
* **HTTP:** `HttpClientModule`, Interceptors (JWT Token ekleme)
* **Diğer:** `jwt-decode` (Token çözümleme)

## 🎯 Özellikler

* **Rol Bazlı Görünüm:** Admin'ler görev atama dropdown'ını, kullanıcı yönetimi panelini ve tüm yönetim butonlarını görürken, User'lar sadece kendilerine atanmış görevleri görür ve yalnızca görev durumunu güncelleyebilir.
* **Kimlik Doğrulama Akışı:** Güvenli Giriş (`/login`), Kayıt (`/register`) ve Şifre Değiştirme (`/profile`) sayfaları. Yetkisiz sayfalara erişimi engelleyen `AuthGuard`.
* **Görev Yönetimi:** Görev ekleme, listeleme (filtreleme ile - Tümü/Bekleyen/Tamamlanan), durum güncelleme ve (admin için) silme.
* **Kullanıcı Yönetimi (Admin):** Profil sayfasında tüm kullanıcıları listeleme ve rollerini (admin/user) değiştirme arayüzü.
* **Responsive Layout:** CSS Grid kullanılarak her ekranda düzgün görünen kart düzeni.
* **Gelişmiş UX:** Görev silme işlemi için onay penceresi (`MatDialog`), boş listeler için özel ekranlar (`Empty States`) ve API istekleri sırasında yükleme durumları (`mat-spinner`), form doğrulama hataları (`mat-error`), başarılı/başarısız işlem bildirimleri (`MatSnackBar`).
* **Navigasyon:** Üst menü (`mat-toolbar`) ile sayfalar arası geçiş, giriş yapan kullanıcı bilgisini gösterme ve çıkış yapma.

## 🚀 Kurulum ve Çalıştırma Adımları

**Önkoşullar:** Node.js, npm, ve Backend API'sinin çalışıyor olması.

1.  **Backend'i Başlatma:**
    * `task-manager-api` projesine gidin ve `npm run start:dev` komutunu çalıştırın (veya canlı API'nin çalıştığından emin olun).

2.  **Bağımlılıkları Yükleme:**
    ```bash
    npm install
    ```

3.  **Ortam Dosyasını Ayarlama:**
    * **Lokal Geliştirme:** `src/environments/environment.ts` dosyasındaki `apiUrl`'ün `http://localhost:3000` olduğundan emin olun.
    * **Canlı Ortam:** `src/environments/environment.prod.ts` dosyasındaki `apiUrl`'ün canlı backend adresiniz (örn: `https://task-manager-api-xxxx.onrender.com`) olduğundan emin olun.

4.  **Uygulamayı Başlatma:**
    ```bash
    ng serve -o
    ```
    *Uygulama, `http://localhost:4200` adresinde açılacaktır.*

## 🔒 Test Akışı (Demo)

1.  Uygulama açıldığında otomatik olarak `/login` sayfasına yönlendirileceksiniz.
2.  **İlk Kullanıcıyı Kaydedin:** `/register` sayfasına gidin ve ilk kullanıcıyı (örn: `admin` / `password123`) kaydedin. Bu kullanıcı otomatik olarak **'admin'** rolünü alacaktır.
3.  **'admin' Kullanıcısıyla Giriş Yapın:**
    * `/login` sayfasından giriş yapın.
    * `/tasks` sayfasında tüm görevleri görebilir, yeni görev ekleyebilir (diğer kullanıcılara atayarak) ve görevleri silebilir/güncelleyebilirsiniz.
    * Üst menüden `/profile` sayfasına gidin. Burada hem kendi şifrenizi değiştirebilir hem de "Kullanıcı Yönetimi" bölümünde diğer kullanıcıların rollerini (admin/user) güncelleyebilirsiniz.
4.  **Yeni Bir 'user' Kaydedin:** `/register` sayfasına gidin ve ikinci bir kullanıcı (örn: `derya` / `sifre123`) kaydedin. Bu kullanıcı **'user'** rolünü alacaktır.
5.  **Çıkış Yapın ve 'user' Kullanıcısıyla Giriş Yapın:**
    * `/login` sayfasından `derya` ile giriş yapın.
    * `/tasks` sayfasında (başlangıçta) görev **görmemelisiniz** (admin henüz görev atamadı). "Kendine Yeni Görev Ekle" formunu kullanarak kendinize görev ekleyebilirsiniz. Eklediğiniz veya size atanan görevlerin sadece **durumunu** (`✔`/`⚪`) değiştirebilirsiniz. Silme/Atama gibi admin kontrolleri **görünmez**.
    * `/profile` sayfasına gidin. Sadece kendi profil bilgilerinizi ve şifre değiştirme formunu görürsünüz. "Kullanıcı Yönetimi" bölümü **görünmez**.
