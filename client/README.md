# Movie Booking Client

Frontend cho ứng dụng đặt vé xem phim, được triển khai trên Vercel.

## Cấu trúc dự án

```
client/
  ├── public/              # Static files
  ├── src/                 # Source code
  │   ├── components/      # Các component React
  │   ├── pages/           # Các trang
  │   ├── services/        # Các service gọi API
  │   ├── context/         # Context API
  │   ├── hooks/           # Custom hooks
  │   ├── utils/           # Tiện ích
  │   ├── assets/          # Hình ảnh, font, v.v.
  │   ├── styles/          # CSS/SCSS
  │   ├── App.js           # Component chính
  │   └── index.js         # Entry point
  ├── .env                 # Biến môi trường cho development
  ├── .env.local           # Biến môi trường local (không commit)
  ├── package.json         # Dependencies
  └── vercel.json          # Cấu hình Vercel
```

## Triển khai lên Vercel

1. Đăng nhập vào Vercel CLI:
```bash
vercel login
```

2. Triển khai:
```bash
vercel
```

3. Triển khai phiên bản production:
```bash
vercel --prod
```

## Biến môi trường

Đảm bảo các biến môi trường sau được cấu hình:

- `REACT_APP_API_URL`: URL của API (ví dụ: https://movie-booking-api.vercel.app/api)

## Tính năng

- Đăng ký và đăng nhập
- Xem danh sách phim đang chiếu và sắp chiếu
- Xem thông tin chi tiết phim
- Xem lịch chiếu và đặt vé
- Chọn ghế và thanh toán
- Xem lịch sử đặt vé
- Hủy đặt vé và hoàn tiền
- Xem sự kiện và tin tức

## Phát triển local

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy client trong chế độ development:
```bash
npm start
```

Client sẽ chạy tại http://localhost:3000
