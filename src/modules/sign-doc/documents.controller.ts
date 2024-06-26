import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { DocumentsService } from './documents.services';
import { Document } from './interface/document.interface';
import { createRawDocDto, retrieveDocDto } from './dto/documents.dto';
import { createPairDocDto, signPairDocDto } from './dto/pair-document.dto';
import { createPairDocWSigDto, signPairDocWSigDto } from './dto/pair-documentV2.dto';


@Controller('docs')
export class DocsController {
  constructor(private docsService: DocumentsService) { }

  // @Get('/retrieve/all')
  // async findAll(): Promise<{ fDocs: Document[], rDocs: Document[] }> {
  //   return this.docsService.findAll();
  // }

  // /* multi sign message */
  // @Get('/retrieve/raw-message')
  // async retrieveRawMessage(@Query() query: retrieveDocDto) {
  //   return this.docsService.retrieveRawMessage(query)
  // }

  // @Post('/create/raw-message')
  // async createRawDocument(@Body() createRawDocumentDto: createRawDocDto) {
  //   return await this.docsService.createRaw(createRawDocumentDto)
  // }

  /*** PAIR DOCUMENT CONTROLLERS ***/

  // @Post('/create/pair-document')
  // async createPairDocument(@Body() pairDocumentDto: createPairDocDto) {
  //   return await this.docsService.createPair(pairDocumentDto)
  // }

  // /* TODO: validate id and user address */
  // @Put('/sign/pair-document')
  // async signPairDocument(@Body() pairDocumentDto: signPairDocDto) {
  //   return await this.docsService.signPair(pairDocumentDto)
  // }

  // /* pair document get doc */
  // @Get('/retrieve/pair-document')
  // async retrievePairDocument(@Query() query: retrieveDocDto) {
  //   return this.docsService.getPairDocument(query)
  // }

  @Post('/pair-document-wsig/create')
  async createPairDocumentWSig(@Body() pairDocumentDto: createPairDocWSigDto) {
    return await this.docsService.createPairWSig(pairDocumentDto)
  }

  /* pair document get doc */
  @Get('/pair-document-wsig/retrieve')
  async retrievePairDocumentWSig(@Query() query: retrieveDocDto) {
    return this.docsService.getPairDocumentWSig(query)
  }

  /* pair document sign doc */
  // /* TODO: validate id and user address */
  @Put('/pair-document-wsig/sign')
  async signPairDocumentWSig(@Body() pairDocumentDto: signPairDocWSigDto) {
    return await this.docsService.signPairWSig(pairDocumentDto)
  }
}
