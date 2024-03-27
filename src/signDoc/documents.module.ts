import { Module } from '@nestjs/common';
import { DocsController } from './documents.controller';
import { DocumentsService } from './documents.services';
import { MongooseModule } from '@nestjs/mongoose';
import { RawDocumentSchema, Raw_Document } from './schemas/rawDocument.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Raw_Document.name, schema: RawDocumentSchema }])],
  controllers: [DocsController],
  providers: [DocumentsService],
})
export class DocsModule { }