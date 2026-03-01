# 🎬 Hệ Thống Quản Lý Đặt Vé Rạp Phim

API backend cho hệ thống quản lý đặt vé rạp phim, xây dựng với NestJS, Prisma ORM và MySQL.

## 📋 Mục lục

- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#️-cài-đặt)
- [Chạy ứng dụng](#️-chạy-ứng-dụng)
- [API Documentation](#-api-documentation)
- [Postman Collection](#-postman-collection)
- [Đặc tả API](#-đặc-tả-api)
- [Cấu trúc Database](#️-cấu-trúc-database)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Thông tin tài khoản Test](#-thông-tin-tài-khoản-test)
- [Troubleshooting](#-troubleshooting)

## 🚀 Công nghệ sử dụng

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: MySQL 8.x
- **ORM**: Prisma 7.x
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt
- **API Documentation**: Swagger (OpenAPI)
- **File Upload**: Multer
- **Container**: Docker

## 📦 Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **Docker**: >= 20.x (để chạy MySQL container)
- **Git**: Latest version

## 🛠️ Cài đặt

### Bước 1: Cài đặt Docker container mysql (nếu chưa có)

> **Lưu ý**: Nếu đã có MySQL container đang chạy, bỏ qua phần này và chuyển đến Bước 2.

Bạn có thể chọn một trong hai cách để tạo và chạy MySQL container:

#### **Cách 1: Sử dụng Docker Command Line**

Chạy lệnh sau để tạo MySQL container mới:

```bash
docker run --name <tên-container> -e MYSQL_ROOT_PASSWORD=<mật-khẩu> -p <port-local>:3306 -d mysql:latest
```

**Ví dụ:**
```bash
docker run --name my_mysql_db -e MYSQL_ROOT_PASSWORD=1234 -p 3309:3306 -d mysql:latest
```

**Giải thích các tham số:**
- `--name <tên-container>`: Đặt tên cho container (tùy chọn, ví dụ: `my_mysql_db`, `QuanLyDatVe_mysql`)
- `-e MYSQL_ROOT_PASSWORD=<mật-khẩu>`: Thiết lập mật khẩu root (ví dụ: `1234`)
- `-p <port-local>:3306`: Map port từ máy local sang container (ví dụ: `3309:3306`)
- `-d mysql:latest`: Chạy MySQL phiên bản mới nhất ở chế độ background

**Các lệnh quản lý container:**
```bash
# Kiểm tra container đã chạy
docker ps

# Xem tất cả container (kể cả đã dừng)
docker ps -a

# Khởi động lại container (nếu đã dừng)
docker start <tên-container>

# Dừng container
docker stop <tên-container>

# Xóa container (nếu cần reset hoàn toàn)
docker rm -f <tên-container>
```

#### **Cách 2: Sử dụng Docker Desktop (Giao diện đồ họa)**

1. Mở **Docker Desktop**
2. Vào tab **Images** → Tìm kiếm `mysql` → Click **Pull** để tải image MySQL
3. Sau khi tải xong, click vào image `mysql:latest` → Click nút **Run**
4. Trong cửa sổ cấu hình container:
   - **Container name**: Đặt tên tùy ý (ví dụ: `my_mysql_db`)
   - **Ports**: Map `3309` (local) → `3306` (container)
   - **Environment variables**: Click **+** để thêm
     - Variable: `MYSQL_ROOT_PASSWORD`
     - Value: `1234` (hoặc mật khẩu bạn muốn)
5. Click **Run** để khởi chạy container

**Quản lý container trong Docker Desktop:**
- Vào tab **Containers** để xem danh sách containers
- Click vào container để Start/Stop/Restart/Delete
- Xem logs, terminal, inspect thông qua các tab bên trong

### Bước 2: Clone repository

```bash
git clone <repository-url>
cd capstone-cuoi-khoa
```

**Hoặc nếu đã có project, pull code mới nhất:**
```bash
git pull
```

### Bước 3: Cài đặt dependencies

```bash
npm install
```

### Bước 4: Cấu hình biến môi trường

Tạo file `.env` ở thư mục root với nội dung:

```env
# Port của ứng dụng
PORT=3069

# Database connection (MySQL)
DATABASE_URL=mysql://root:<mật-khẩu>@localhost:<port-local>/QuanLyDatVe

# JWT Secret Key (tạo random string phức tạp cho production)
ACCESS_TOKEN_SECRET=<your_secret>
```

**Ví dụ:**
```env
PORT=3069
DATABASE_URL=mysql://root:1234@localhost:3309/QuanLyDatVe
ACCESS_TOKEN_SECRET=W&Y~q%Fynh[~={QyZncr;}
```

**Giải thích DATABASE_URL:**
- `mysql://`: Protocol
- `root`: Username của MySQL
- `<mật-khẩu>`: Password của MySQL (phải khớp với `MYSQL_ROOT_PASSWORD` trong Docker)
- `localhost:<port-local>`: Host và port (khớp với port đã map ở Bước 1)
- `QuanLyDatVe`: Tên database (sẽ được tự động tạo khi chạy migration)

### Bước 5: Chạy Prisma migrations

Lệnh này sẽ tạo database và tất cả các bảng theo schema:

```bash
npx prisma migrate dev
```

**Lưu ý:** 
- Lệnh này sẽ tự động chạy tất cả migrations trong folder `prisma/migrations`
- Database `QuanLyDatVe` sẽ được tạo tự động nếu chưa tồn tại
- Tất cả các bảng sẽ được tạo với đầy đủ relationships và constraints

### Bước 6: Generate Prisma Client

```bash
npx prisma generate
```

Lệnh này sẽ generate Prisma Client vào `src/modules-system/prisma/generated/prisma`

### Bước 7: Import dữ liệu mẫu

Để có dữ liệu mẫu cho việc test API, chạy lệnh tất cả các lệnh query trong file `query.sql`:

**Sử dụng GUI Tool (TablePlus, MySQL Workbench, v.v.)**
1. Kết nối tới database `QuanLyDatVe`
2. Mở file `query.sql`
3. Execute toàn bộ script

**Dữ liệu mẫu bao gồm:**
- 2 người dùng test (1 admin + 1 khách hàng)
- 5 phim
- 3 banner
- 5 hệ thống rạp (BHD, CGV, CineStar, Lotte, Galaxy)
- 10 cụm rạp
- 50 rạp phim
- 8,000 ghế (160 ghế/rạp)
- 200 lịch chiếu

## ▶️ Chạy ứng dụng

### Development mode (hot-reload)
```bash
npm run start:dev
```

**Server sẽ chạy tại:** `http://localhost:3069`

## 📚 API Documentation

Sau khi khởi động server, bạn có thể test API bằng 2 cách:

### Option 1: Swagger UI (Recommended cho khám phá API)

Truy cập Swagger UI tại:

```
http://localhost:3069/api-docs
```

### Option 2: Postman Collection (Recommended cho testing chuyên sâu)

Import Postman collection từ folder `postman/` (xem hướng dẫn chi tiết ở phần [Postman Collection](#-postman-collection))

**Chi tiết đầy đủ về tất cả endpoints**: Xem phần [Đặc tả API](#-đặc-tả-api)

---

### Các nhóm API chính:

- **Auth**: Đăng ký, đăng nhập, xác thực JWT
- **Quản lý người dùng**: CRUD người dùng
- **Quản lý hệ thống rạp**: CRUD hệ thống rạp, cụm rạp, rạp phim
- **Quản lý phim**: CRUD phim và lịch chiếu
- **Quản lý banner**: Upload và quản lý ảnh banner
- **Quản lý ghế**: Xem ghế theo lịch chiếu
- **Đặt vé**: Đặt vé, xem lịch sử đặt vé

### Authentication

API sử dụng JWT Bearer Token. Để authenticate:

1. Đăng nhập qua endpoint `/api/auth/login`
2. Copy access token từ response
3. Trong Swagger UI, click nút **Authorize** (🔒)
4. Paste token vào và click **Authorize**

## � Postman Collection

Ngoài Swagger UI, bạn có thể sử dụng Postman để test API với collection có sẵn.

### Import Postman Collection và Environment

**Bước 1: Mở Postman**
- Tải và cài đặt [Postman](https://www.postman.com/downloads/) nếu chưa có
- Hoặc sử dụng Postman Web tại [postman.com](https://www.postman.com/)

**Bước 2: Import Collection**
1. Trong Postman, click vào nút **Import** (góc trên bên trái)
2. Chọn tab **File** hoặc kéo thả file vào
3. Chọn file `postman/DuAnCuoiKhoa.postman_collection.json`
4. Click **Import**

**Bước 3: Import Environment**
1. Click vào nút **Import** lần nữa
2. Chọn file `postman/DuAnCuoiKhoa.postman_environment.json`
3. Click **Import**
4. Chọn environment **DuAnCuoiKhoa** từ dropdown ở góc trên bên phải

**Bước 4: Cấu hình Environment Variables**
1. Click vào icon ⚙️ (Settings) → **Environments**
2. Chọn environment **DuAnCuoiKhoa**
3. Cập nhật các biến nếu cần:
   - `baseUrl`: `http://localhost:3069/api` (mặc định)
   - `accessToken`: Sẽ tự động được set sau khi login

**Bước 5: Sử dụng Collection**
1. Mở folder **Auth** trong collection
2. Chạy request **Login** với một trong hai tài khoản test
3. Access token sẽ tự động được lưu vào environment variable
4. Giờ bạn có thể test các endpoints khác trong collection!

**Lưu ý:** 
- Collection đã được cấu hình sẵn Bearer Token authentication
- Sau khi login, token sẽ tự động được sử dụng cho các request tiếp theo
- Nếu token hết hạn, chỉ cần login lại
## 📖 Đặc tả API

### 🔐 Phân quyền

- **Public**: Không cần đăng nhập
- **🔒 Protected**: Cần đăng nhập (Bearer Token)
- **👑 QUAN_TRI**: Chỉ tài khoản có role QUAN_TRI mới được truy cập

---

### 1. Auth (Xác thực)

#### 1.1. Đăng ký
- **Endpoint**: `POST /api/auth/register`
- **Phân quyền**: Public
- **Body**:
```json
{
  "tai_khoan": "string",
  "ho_ten": "string",
  "email": "string",
  "so_dt": "string",
  "mat_khau": "string"
}
```

#### 1.2. Đăng nhập
- **Endpoint**: `POST /api/auth/login`
- **Phân quyền**: Public
- **Body**:
```json
{
  "tai_khoan": "string",
  "mat_khau": "string"
}
```
- **Response**: Trả về `accessToken` để sử dụng cho các request tiếp theo

---

### 2. Users (Quản lý người dùng)

#### 2.1. Lấy thông tin tài khoản hiện tại
- **Endpoint**: `GET /api/users/profile`
- **Phân quyền**: 🔒 Protected

#### 2.2. Cập nhật thông tin tài khoản của chính mình
- **Endpoint**: `PUT /api/users/profile`
- **Phân quyền**: 🔒 Protected
- **Body**:
```json
{
  "ho_ten": "string",
  "email": "string",
  "so_dt": "string",
  "mat_khau": "string" // optional
}
```

#### 2.3. Tạo người dùng mới
- **Endpoint**: `POST /api/users/create-user`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "tai_khoan": "string",
  "ho_ten": "string",
  "email": "string",
  "so_dt": "string",
  "mat_khau": "string",
  "loai_nguoi_dung": "KHACH_HANG | QUAN_TRI"
}
```

#### 2.4. Lấy danh sách người dùng
- **Endpoint**: `GET /api/users/get-users`
- **Phân quyền**: 👑 QUAN_TRI
- **Query params**:
  - `page`: number (bắt buộc)
  - `pageSize`: number (bắt buộc)
  - `filters`: string (optional, JSON string)

#### 2.5. Lấy thông tin người dùng theo tài khoản
- **Endpoint**: `GET /api/users/detail/:tai_khoan`
- **Phân quyền**: 👑 QUAN_TRI

#### 2.6. Cập nhật thông tin người dùng
- **Endpoint**: `PUT /api/users/update`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "tai_khoan": "string",
  "ho_ten": "string",
  "email": "string",
  "so_dt": "string",
  "mat_khau": "string", // optional
  "loai_nguoi_dung": "KHACH_HANG | QUAN_TRI"
}
```

#### 2.7. Xóa người dùng
- **Endpoint**: `DELETE /api/users/delete/:tai_khoan`
- **Phân quyền**: 👑 QUAN_TRI

---

### 3. Movies (Quản lý phim)

#### 3.1. Lấy danh sách phim
- **Endpoint**: `GET /api/movies`
- **Phân quyền**: Public
- **Query params**:
  - `page`: number (bắt buộc)
  - `pageSize`: number (bắt buộc)
  - `filters`: string (optional, JSON string)

#### 3.2. Tạo phim mới
- **Endpoint**: `POST /api/movies/create-movie`
- **Phân quyền**: 👑 QUAN_TRI
- **Content-Type**: `multipart/form-data`
- **Form data**:
  - `ten_phim`: string
  - `trailer`: string
  - `mo_ta`: string
  - `ngay_khoi_chieu`: string (YYYY-MM-DD)
  - `danh_gia`: number (0-10)
  - `thoi_luong`: number (phút)
  - `hot`: boolean
  - `dang_chieu`: boolean
  - `sap_chieu`: boolean
  - `image`: file (max 5MB)

#### 3.3. Cập nhật phim
- **Endpoint**: `PUT /api/movies/update-movie`
- **Phân quyền**: 👑 QUAN_TRI
- **Content-Type**: `multipart/form-data`
- **Form data**:
  - `ma_phim`: number (bắt buộc)
  - `ten_phim`: string (optional)
  - `trailer`: string (optional)
  - `mo_ta`: string (optional)
  - `ngay_khoi_chieu`: string (optional)
  - `danh_gia`: number (optional)
  - `thoi_luong`: number (optional)
  - `hot`: boolean (optional)
  - `dang_chieu`: boolean (optional)
  - `sap_chieu`: boolean (optional)
  - `image`: file (optional, max 5MB)

#### 3.4. Xóa phim
- **Endpoint**: `DELETE /api/movies/delete-movie/:ma_phim`
- **Phân quyền**: 👑 QUAN_TRI

#### 3.5. Lấy lịch chiếu theo phim
- **Endpoint**: `GET /api/movies/showtimes-by-movie/:ma_phim`
- **Phân quyền**: Public

#### 3.6. Lấy lịch chiếu theo cụm rạp
- **Endpoint**: `GET /api/movies/showtimes-by-cinema/:ma_cum_rap`
- **Phân quyền**: Public

---

### 4. Showtimes (Quản lý lịch chiếu)

#### 4.1. Tạo lịch chiếu mới
- **Endpoint**: `POST /api/movies/create-showtime`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "ma_rap": number,
  "ma_phim": number,
  "ngay_gio_chieu": "YYYY-MM-DD HH:mm:ss",
  "gia_ve": number
}
```

#### 4.2. Cập nhật lịch chiếu
- **Endpoint**: `PUT /api/movies/update-showtime`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "ma_lich_chieu": number,
  "ma_rap": number (optional),
  "ma_phim": number (optional),
  "ngay_gio_chieu": "YYYY-MM-DD HH:mm:ss" (optional),
  "gia_ve": number (optional)
}
```

#### 4.3. Xóa lịch chiếu
- **Endpoint**: `DELETE /api/movies/delete-showtime/:ma_lich_chieu`
- **Phân quyền**: 👑 QUAN_TRI

---

### 5. Banners (Quản lý banner)

#### 5.1. Lấy danh sách banner
- **Endpoint**: `GET /api/banners`
- **Phân quyền**: Public

#### 5.2. Upload banner mới
- **Endpoint**: `POST /api/banners`
- **Phân quyền**: 👑 QUAN_TRI
- **Content-Type**: `multipart/form-data`
- **Form data**:
  - `ma_phim`: number
  - `image`: file (max 5MB)

#### 5.3. Xóa banner
- **Endpoint**: `DELETE /api/banners/:ma_banner`
- **Phân quyền**: 👑 QUAN_TRI

---

### 6. Systems (Quản lý hệ thống rạp)

#### 6.1. Hệ thống rạp (Cinema System)

##### 6.1.1. Lấy danh sách hệ thống rạp
- **Endpoint**: `GET /api/systems/cinema-system`
- **Phân quyền**: Public

##### 6.1.2. Tạo hệ thống rạp mới
- **Endpoint**: `POST /api/systems/cinema-system`
- **Phân quyền**: 👑 QUAN_TRI
- **Content-Type**: `multipart/form-data`
- **Form data**:
  - `ten_he_thong_rap`: string
  - `logo`: file (max 5MB)

##### 6.1.3. Cập nhật hệ thống rạp
- **Endpoint**: `PUT /api/systems/cinema-system`
- **Phân quyền**: 👑 QUAN_TRI
- **Content-Type**: `multipart/form-data`
- **Form data**:
  - `ma_he_thong_rap`: number (bắt buộc)
  - `ten_he_thong_rap`: string (optional)
  - `logo`: file (optional, max 5MB)

##### 6.1.4. Xóa hệ thống rạp
- **Endpoint**: `DELETE /api/systems/cinema-system/:ma_he_thong_rap`
- **Phân quyền**: 👑 QUAN_TRI

#### 6.2. Cụm rạp (Cinema Complex)

##### 6.2.1. Lấy danh sách cụm rạp theo hệ thống rạp
- **Endpoint**: `GET /api/systems/cinema-complex/:ma_he_thong_rap`
- **Phân quyền**: Public

##### 6.2.2. Tạo cụm rạp mới
- **Endpoint**: `POST /api/systems/cinema-complex`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "ten_cum_rap": "string",
  "dia_chi": "string",
  "ma_he_thong_rap": number
}
```

##### 6.2.3. Cập nhật cụm rạp
- **Endpoint**: `PUT /api/systems/cinema-complex`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "ma_cum_rap": number,
  "ten_cum_rap": "string" (optional),
  "dia_chi": "string" (optional),
  "ma_he_thong_rap": number (optional)
}
```

##### 6.2.4. Xóa cụm rạp
- **Endpoint**: `DELETE /api/systems/cinema-complex/:ma_cum_rap`
- **Phân quyền**: 👑 QUAN_TRI

#### 6.3. Rạp phim (Cinema)

##### 6.3.1. Lấy danh sách rạp theo cụm rạp
- **Endpoint**: `GET /api/systems/cinema/:ma_cum_rap`
- **Phân quyền**: Public

##### 6.3.2. Tạo rạp mới
- **Endpoint**: `POST /api/systems/cinema`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "ten_rap": "string",
  "ma_cum_rap": number
}
```

##### 6.3.3. Cập nhật rạp
- **Endpoint**: `PUT /api/systems/cinema`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "ma_rap": number,
  "ten_rap": "string" (optional),
  "ma_cum_rap": number (optional)
}
```

##### 6.3.4. Xóa rạp
- **Endpoint**: `DELETE /api/systems/cinema/:ma_rap`
- **Phân quyền**: 👑 QUAN_TRI

---

### 7. Seats (Quản lý ghế)

#### 7.1. Lấy danh sách ghế theo suất chiếu
- **Endpoint**: `GET /api/seats/:ma_lich_chieu`
- **Phân quyền**: Public
- **Note**: Hiển thị thông tin ghế đã đặt và còn trống

#### 7.2. Thêm ghế mới
- **Endpoint**: `POST /api/seats`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "ten_ghe": "string",
  "loai_ghe": "Thuong | Vip",
  "ma_rap": number
}
```

#### 7.3. Cập nhật ghế
- **Endpoint**: `PUT /api/seats`
- **Phân quyền**: 👑 QUAN_TRI
- **Body**:
```json
{
  "ma_ghe": number,
  "ten_ghe": "string" (optional),
  "loai_ghe": "Thuong | Vip" (optional),
  "ma_rap": number (optional)
}
```

#### 7.4. Xóa ghế
- **Endpoint**: `DELETE /api/seats/:ma_ghe`
- **Phân quyền**: 👑 QUAN_TRI
- **Note**: Không thể xóa ghế đã từng được đặt vé

---

### 8. Tickets (Quản lý đặt vé)

#### 8.1. Xem lịch sử đặt vé
- **Endpoint**: `GET /api/tickets/history`
- **Phân quyền**: 🔒 Protected
- **Note**: Hiển thị lịch sử đặt vé của người dùng đang đăng nhập

#### 8.2. Xem chi tiết vé
- **Endpoint**: `GET /api/tickets/detail/:ma_dat_ve`
- **Phân quyền**: 🔒 Protected
- **Note**: Chỉ xem được vé của chính mình

#### 8.3. Đặt vé
- **Endpoint**: `POST /api/tickets`
- **Phân quyền**: 🔒 Protected
- **Body**:
```json
{
  "ma_lich_chieu": number,
  "danh_sach_ghe": [number] // Mảng các mã ghế
}
```
- **Note**: Có thể đặt nhiều ghế cùng lúc

---
## �🗄️ Cấu trúc Database

### Các bảng chính:

- **NguoiDung**: Người dùng (tài khoản, email, mật khẩu, role)
- **HeThongRap**: Hệ thống rạp (CGV, Galaxy, BHD...)
- **CumRap**: Cụm rạp (thuộc hệ thống rạp)
- **RapPhim**: Rạp phim cụ thể (thuộc cụm rạp)
- **Ghe**: Ghế trong rạp
- **Phim**: Thông tin phim
- **LichChieu**: Lịch chiếu phim
- **DatVe**: Thông tin đặt vé
- **ChiTietDatVe**: Chi tiết ghế đã đặt
- **Banner**: Banner quảng cáo

### Xem và quản lý database:

**Option 1: Prisma Studio (Built-in)**
```bash
npx prisma studio
```
Prisma Studio sẽ mở tại `http://localhost:5555` cho phép xem và chỉnh sửa data trực tiếp.

**Option 2: TablePlus (Recommended)**
1. Tải và cài đặt [TablePlus](https://tableplus.com/)
2. Tạo kết nối mới với thông tin:
   - **Host**: `localhost`
   - **Port**: `<port-local>` (ví dụ: `3309`)
   - **User**: `root`
   - **Password**: `<mật-khẩu>` (ví dụ: `1234`)
   - **Database**: `QuanLyDatVe`

**Option 3: MySQL Workbench, DBeaver, hoặc các GUI tool khác**

Sử dụng thông tin kết nối tương tự như TablePlus.

## 📁 Cấu trúc thư mục

```
capstone-cuoi-khoa/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
├── public/
│   └── images/                 # Uploaded images
│       ├── banners/
│       ├── cinema-system/
│       └── movies/
├── postman/                    # Postman collection & environment
│   ├── DuAnCuoiKhoa.postman_collection.json
│   └── DuAnCuoiKhoa.postman_environment.json
├── src/
│   ├── common/                 # Shared utilities
│   │   ├── configs/            # Configuration files
│   │   ├── decorators/         # Custom decorators
│   │   ├── guards/             # Auth guards
│   │   ├── helpers/            # Helper functions
│   │   └── interceptors/       # Interceptors
│   ├── modules-api/            # API modules
│   │   ├── auth/
│   │   ├── banner/
│   │   ├── movies/
│   │   ├── seats/
│   │   ├── systems/
│   │   ├── ticket/
│   │   └── users/
│   ├── modules-system/         # System modules
│   │   ├── prisma/
│   │   └── token/
│   ├── app.module.ts
│   └── main.ts
├── .env                        # Environment variables
├── package.json
├── query.sql                   # Sample data SQL script
└── README.md
```

## 👥 Thông tin tài khoản Test

> **Lưu ý**: Các tài khoản này chỉ khả dụng sau khi chạy file `query.sql` ở Bước 7

### Tài khoản Admin (Quản trị viên)
- **Tài khoản**: `admin`
- **Mật khẩu**: `Admin@123`
- **Role**: `QUAN_TRI`
- **Email**: admin@admin.com

### Tài khoản User (Khách hàng)
- **Tài khoản**: `mdtrong1305`
- **Mật khẩu**: `123@123`
- **Role**: `KHACH_HANG`
- **Email**: mdtrong1305@gmail.com

**Cách sử dụng:**
1. Vào Swagger UI: `http://localhost:3069/api-docs`
2. Thử endpoint `/api/auth/login`
3. Đăng nhập với một trong hai tài khoản trên
4. Copy `accessToken` từ response
5. Click nút **Authorize** (🔒) và paste token
6. Giờ bạn có thể test các protected endpoints!

*Lưu ý: Đổi mật khẩu admin ngay sau khi setup trong môi trường production*

## 🐛 Troubleshooting

### Lỗi kết nối database
```bash
# Kiểm tra MySQL container có đang chạy không
docker ps

# Xem logs của container
docker logs <tên-container>

# Restart container
docker restart <tên-container>

# Hoặc dùng Docker Desktop: vào tab Containers → Click vào container → Start/Restart
```

### Lỗi Prisma Client
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset và migrate lại
npx prisma migrate reset
```

### Lỗi port bị chiếm
```bash
# Thay đổi PORT trong file .env
PORT=3070
```

## 📝 License

Public project - mdtrong1305

---

**Happy Coding! 🚀**