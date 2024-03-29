import { Module } from '@nestjs/common';
import { DocsController } from './documents.controller';
import { DocumentsService } from './documents.services';
import { MongooseModule } from '@nestjs/mongoose';
import { RawDocumentSchema, Raw_Document } from './schemas/rawDocument.schema';
import { PairDocumentSchema, Pair_Document } from './schemas/pairDocument.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Raw_Document.name, schema: RawDocumentSchema },
    { name: Pair_Document.name, schema: PairDocumentSchema },

  ])],
  controllers: [DocsController],
  providers: [DocumentsService],
})
export class DocsModule { }