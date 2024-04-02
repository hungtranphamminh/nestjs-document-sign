import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DocsController } from './documents.controller';
import { DocumentsService } from './documents.services';
import { MongooseModule } from '@nestjs/mongoose';
import { RawDocumentSchema, Raw_Document } from './schemas/raw-document.schema';
import { PairDocumentSchema, Pair_Document } from './schemas/pair-document.schema';
import { DocumentAccessMiddleware, SignatureValidationMiddleware } from 'src/middlewares/pair-document.middleware';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Raw_Document.name, schema: RawDocumentSchema },
    { name: Pair_Document.name, schema: PairDocumentSchema },

  ])],
  controllers: [DocsController],
  providers: [DocumentsService],
})
export class DocsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DocumentAccessMiddleware, SignatureValidationMiddleware)
      .forRoutes('docs/sign/pair-document')
  }
}