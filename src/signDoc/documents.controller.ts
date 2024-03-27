import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DocumentsService } from './documents.services';
import { Document } from './interface/document.interface';
import { createRawDocDto, retrieveDocDto } from './dto/documents.dto';

@Controller('docs')
export class DocsController {
  constructor(private docsService: DocumentsService) { }

  @Get('/retrieve/all')
  async findAll(): Promise<{ fDocs: Document[], rDocs: Document[] }> {
    return this.docsService.findAll();
  }

  @Get('/retrieve/raw-message')
  async retrieveRawMessage(@Query() query: retrieveDocDto) {
    return this.docsService.retrieveRawMessage(query)
  }

  @Post('/create/raw-message')
  async createRawDocument(@Body() createRawDocumentDto: createRawDocDto) {
    return await this.docsService.createRaw(createRawDocumentDto)
  }
}
