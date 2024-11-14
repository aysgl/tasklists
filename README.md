# Görev Yönetimi

## Özellikler

-   **Dashboard**: Kullanıcıların atanmış, başarılı, başarısız ve süresi geçmiş
    görevleri kategoriler halinde görüntülemesi.
-   **Görev Listesi**: Görevleri görev adı, tarih, atanan kullanıcı gibi
    kriterlere göre filtreleyerek listeleyebilme. Ayrıca görev üzerinde CRUD
    (oluşturma, okuma, güncelleme, silme) işlemleri yapılabilir.

-   **Takvim**: FullCalendar kullanarak, görevlerin başlangıç ve bitiş
    tarihlerine göre takvime yansıtılması. Ayrıca, takvimdeki görevler üzerinde
    CRUD işlemleri yapılabilir.

-   **Kullanıcılar**: Sistemdeki tüm kullanıcıları, atanan görev durumu ve
    geciken görev sayıları gibi bilgileriyle listeleyebilme. Kullanıcılar
    üzerinde de CRUD işlemleri gerçekleştirilebilir.

## Teknolojiler

-   🖼️ **Vue3 ve Vuetify3**: Modern ve reaktif bir UI geliştirme deneyimi için
    en son Vue 3 ve Vuetify 3 kullanılmaktadır.  
    [Vue 3](https://v3.vuejs.org/) | [Vuetify 3](https://vuetifyjs.com/en/)
-   🗃️ **Durum Yönetimi**: Vue için sezgisel ve modüler bir durum yönetim çözümü
    olan [Pinia](https://pinia.vuejs.org/) ile entegre edilmiştir.

-   🚦 **Yönlendirme ve Düzenler**: SPA (Tek Sayfa Uygulaması) navigasyonu için
    Vue Router ve Vue dosya düzenlerini organize etmek için
    vite-plugin-vue-layouts kullanılır.  
    [Vue Router](https://router.vuejs.org/) |
    [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts)
-   💻 **Geliştirilmiş Geliştirme Deneyimi**: TypeScript'in statik tip denetimi
    ve Vue için ESLint eklenti seti ile kod kalitesi ve tutarlılığı sağlanır.  
    [TypeScript](https://www.typescriptlang.org/) |
    [ESLint Plugin Vue](https://eslint.vuejs.org/)
-   ⚡ **Son Teknoloji Araçları**: Vite ile hızlı başlatmalar ve anlık HMR (Hot
    Module Replacement) deneyimi sunar.  
    [Vite](https://vitejs.dev/)
-   🛠️ **Güçlü Tiplenmiş Vue**: Vue bileşenlerinizi tip denetimi yapmak için
    vue-tsc kullanarak sağlam bir geliştirme deneyimi sağlar.  
    [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc)
-   📅 **FullCalendar**: Takvim ve etkinlik yönetimi için FullCalendar
    kütüphanesi entegre edilmiştir.  
    [FullCalendar](https://fullcalendar.io/)

Bu özellikler, Vuetify uygulamanızın güçlü ve sürdürülebilir olmasını sağlamak
için kurulumu ve dağıtımı kolay bir geliştirme deneyimi sunar.

## 💡 Kullanım

Bu bölüm, geliştirme sunucusunu nasıl başlatacağınızı ve projenizi üretim için
nasıl derleyeceğinizi açıklar.

### Geliştirme Sunucusunu Başlatma

Hot-reload özelliğiyle geliştirme sunucusunu başlatmak için aşağıdaki komutu
çalıştırın. Sunucu, [http://localhost:3000](http://localhost:3000) adresinden
erişilebilir olacaktır:

```bash
npm run dev
```

### Üretim İçin Derleme

Projenizi üretim ortamı için derlemek için şu komutu kullanın:

```bash
npm run build
```
