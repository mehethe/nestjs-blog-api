import { Module } from '@nestjs/common';
import { BlogsModule } from './blogs/blogs.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes it globally available
      envFilePath: '.env',
      validate: (config) => {
        const parsed = configValidationSchema.safeParse(config);
        if (!parsed.success) {
          // Log all validation errors
          parsed.error.errors.forEach((err) => {
            console.error(
              `Invalid environment variable: ${err.path.join('.')}`,
            );
            console.error(`Error: ${err.message}`);
          });

          // Throw an error to halt the application startup
          throw new Error('Invalid environment configuration');
        }
        return parsed.data;
      },
    }),
    SharedModule,
    BlogsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
