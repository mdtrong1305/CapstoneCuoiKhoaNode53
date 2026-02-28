lệnh tạo mysql
docker run --name QuanLyDatVe_mysql -e MYSQL_ROOT_PASSWORD=1234 -p 3309:3306 -d mysql:latest
tk: admin
mk: Admin@123
# 1. Pull code
git pull

# 2. Install
npm install

# 3. Setup .env với DATABASE_URL

# 4. Chạy migrations (tất cả migrations sẽ tự động chạy)
npx prisma migrate dev

# 5. Generate client
npx prisma generate

# Xong! Database đã giống 100% với máy bạn