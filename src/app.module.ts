import { Module } from '@nestjs/common';
import { DocsModule } from './signDoc/documents.module';
import { ConfigModule } from '@nestjs/config';
import { ENV_CONFIG } from './config/configModule.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(ENV_CONFIG),
    DatabaseModule,
    DocsModule,
  ],
})
export class AppModule { }
