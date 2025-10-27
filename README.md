# 🎨 Task Manager - UI (Frontend)

Bu proje, Nest.JS API'sini tüketen, Rol Tabanlı Yetkilendirme (RBAC) özelliklerini yansıtan ve ileri düzey UX/UI prensiplerini kullanan bir Angular arayüzüdür.

## 🛠️ Kullanılan Teknolojiler

* **Framework:** Angular 17 (Standalone Components)
* **UI/UX:** Angular Material (Cards, Buttons, Dialogs, Spinners)
* **Routing:** Login Guard (Giriş yapılmamışsa erişimi engeller)
* **State:** Reactive Forms ile form yönetimi ve yerel durum yönetimi.
* **Interceptors:** JWT Token'ı tüm giden HTTP isteklerine otomatik ekler.

## 🎯 Özellikler

* **Rol Bazlı Görünüm:** Admin'ler görev atama dropdown'ını ve yönetim butonlarını görürken, User'lar sadece kendi görevlerini görür.
* **Responsive Layout:** CSS Grid kullanılarak her ekranda düzgün görünen kart düzeni.
* **Gelişmiş UX:** Silme işlemi için onay penceresi (`MatDialog`), boş listeler için özel ekranlar (`Empty States`) ve yükleme durumları (`mat-spinner`).
* **Hesap Yönetimi:** Kullanıcılar şifrelerini güncelleyebilir.

## 🚀 Kurulum ve Çalıştırma Adımları

**Önkoşullar:** Node.js, npm, ve Backend API'sinin çalışıyor olması.

1.  **Backend'i Başlatma:**
    * `newcomer-tasks-api` projesine gidin ve `npm run start:dev` komutunu çalıştırın. (Bu, **ilk ve zorunlu** adımdır.)

2.  **Bağımlılıkları Yükleme:**
    ```bash
    npm install
    ```

3.  **Uygulamayı Başlatma:**
    ```bash
    ng serve -o
    ```
    *Uygulama, `http://localhost:4200` adresinde açılacaktır.*

## 🔒 Test Akışı (Demo)

1.  Uygulama açıldığında otomatik olarak `/login` sayfasına yönlendirileceksiniz.
2.  **'admin' Kullanıcısıyla Giriş Yapın:**
    * **Username:** `admin` (veya kaydettiğiniz admin)
    * **Password:** `password123` (veya kaydettiğiniz şifre)
    * **Gözlem:** Görevleri **atamaya, eklemeye ve silmeye** izin verilecektir.
3.  **Çıkış Yapın ve 'user' Kullanıcısıyla Giriş Yapın:**
    * **Username:** `derya` (veya kaydettiğiniz user)
    * **Gözlem:** Görevleri sadece **görebilecek**, ancak ekleme veya silme butonları pasif/gizlenmiş olacaktır.