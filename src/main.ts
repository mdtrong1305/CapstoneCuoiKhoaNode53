import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/constant/app.constant';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/responese-success.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // đặt api global prefix cho toàn bộ route trong ứng dụng
  app.setGlobalPrefix('api');
  // bật global pipe để tự động validate dữ liệu đầu vào cho toàn bộ ứng dụng
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  // đăng ký global interceptor để log thông tin request toàn bộ ứng dụng
  app.useGlobalInterceptors(new LoggingInterceptor());
  // đăng ký global interceptor để chuẩn hóa response success toàn bộ ứng dụng
  app.useGlobalInterceptors(new ResponseSuccessInterceptor());
  // cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Quan Ly Rap Phim API')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addTag('Auth', 'Xác thực và đăng ký')
    .addTag('Quản lý người dùng', 'CRUD người dùng')
    .addTag('Quản lý phim và lịch chiếu', 'CRUD phim và lịch chiếu')
    .addTag('Quản lý banner', 'CRUD banner')
    .addTag('Quản lý hệ thống rạp, cụm rạp và rạp phim', 'CRUD hệ thống rạp, cụm rạp và rạp phim')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  // response error đã được nestjs xử lý sẵn thông qua exception filter
  const port = PORT || 3069;
  await app.listen(port, () => {
    console.log(`🤷 Server online at: ${port}`);
    console.log(`📚 Swagger API docs: http://localhost:${port}/api-docs`);
  });
}
bootstrap();
