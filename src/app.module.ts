import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DocsModule } from './sign-doc/documents.module';
import { ConfigModule } from '@nestjs/config';
import { ENV_CONFIG } from './config/config-module.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(ENV_CONFIG),
    DatabaseModule,
    DocsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

  }
}
