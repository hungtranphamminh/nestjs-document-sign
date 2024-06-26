import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DocsController } from './documents.controller';
import { DocumentsService } from './documents.services';
import { MongooseModule } from '@nestjs/mongoose';
import { RawDocumentSchema, Raw_Document } from './schemas/raw-document.schema';
import { PairDocumentSchema, Pair_Document } from './schemas/pair-document.schema';
import { DocumentAccessMiddleware, SignatureValidationMiddleware } from 'src/middlewares/pair-document.middleware';
import { PairDocumentWSigSchema, Pair_Document_W_Sig } from './schemas/pair-documentV2.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Raw_Document.name, schema: RawDocumentSchema },
    { name: Pair_Document.name, schema: PairDocumentSchema },
    { name: Pair_Document_W_Sig.name, schema: PairDocumentWSigSchema },


  ])],
  controllers: [DocsController],
  providers: [DocumentsService],
})
export class DocsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SignatureValidationMiddleware)
      .forRoutes('docs/pair-document-wsig/*')
  }
}