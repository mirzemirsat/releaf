# Releaf | Brand & Commerce Prototype

Pomodoro odaklanma ve dinlenme döngüsünü hareketli çiçek karakterleriyle anlatan; ürün keşfi, sepet ve sipariş demosunu bir araya getiren marka sitesi.

## Öne çıkanlar

- Odaklanma/dinlenme durumuna tepki veren SVG çiçek animasyonları.
- Etkileşimli Pomodoro sayacı.
- Yedi karakterden oluşan koleksiyon, ürün ve paket sayfaları.
- Tarayıcıda saklanan sepet.
- Sunucu tarafında yeniden hesaplanan fiyat, indirim ve kargo toplamları.
- Ödeme ve sipariş onayını simüle eden checkout akışı.

## Teknolojiler

Next.js 15, React, TypeScript, Tailwind CSS 4, Framer Motion ve Zustand. Katalog uygulama içindeki tipli modüllerde tutulur.

## Yerel çalıştırma

```bash
git clone https://github.com/mirzemirsat/releaf.git
cd releaf
npm ci
npm run dev
```

`http://localhost:3000` adresini açın. Derleme ve başlatma:

```bash
npm run build
npm start
```

Temel demo için veritabanı veya API anahtarı gerekmez. Node gereksinimi kullanılan Next.js sürümüyle uyumlu olmalıdır; mevcut Node sürümü desteği `package-lock.json` üzerinden kontrol edilmelidir.

## Sayfalar

| Yol | İçerik |
| --- | --- |
| `/` | Marka anlatımı ve Pomodoro demosu |
| `/shop`, `/collection` | Ürünler ve karakter koleksiyonu |
| `/product/[slug]` | Ürün ayrıntıları |
| `/guide`, `/about` | Kullanım rehberi ve marka |
| `/checkout` | Sipariş demosu |
| `/api/checkout` | Sunucu tarafı tutar hesaplama ve ödeme simülasyonu |

## Demo kapsamı

Gerçek ödeme alınmaz. Checkout, kalıcı sipariş veritabanı, stok yönetimi ve doğrulanmış e-posta gönderimi içermez; gerçek ticari kullanım için bu servisler eklenmelidir. Sepet tarayıcıda saklanır. Ürün metinleri ve fiyatlar demo katalog içeriğidir.

## Kaynak yapısı

`src/components/` marka ve alışveriş bileşenlerini; `src/lib/` ürün, fiyat, para ve sepet mantığını; `src/app/` sayfa ve API rotalarını içerir.
