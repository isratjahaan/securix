import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ForensicsService } from './forensics.service';

@ApiTags('Digital Forensics & Chain of Custody')
@Controller('forensics')
export class ForensicsController {
  constructor(private readonly forensicsService: ForensicsService) {}

  @Get('cases')
  @ApiOperation({ summary: 'List forensic investigation cases' })
  getCases() {
    return this.forensicsService.getCases();
  }

  @Get('cases/:id')
  @ApiOperation({ summary: 'Get case details and cataloged evidence items' })
  getCaseById(@Param('id') id: string) {
    return this.forensicsService.getCaseById(id);
  }

  @Post('cases')
  @ApiOperation({ summary: 'Open new digital forensics investigation case' })
  createCase(@Body() body: any) {
    return this.forensicsService.createCase(body);
  }

  @Get('evidence')
  @ApiOperation({ summary: 'List evidence items with cryptographic SHA-256 integrity hashes' })
  getEvidence(@Query('caseNumber') caseNumber?: string) {
    return this.forensicsService.getEvidence(caseNumber);
  }

  @Post('evidence')
  @ApiOperation({ summary: 'Catalog new digital evidence with verified cryptographic hash' })
  addEvidence(@Body() body: any) {
    return this.forensicsService.addEvidence(body);
  }

  @Get('custody')
  @ApiOperation({ summary: 'Get immutable chain of custody chronological log' })
  getChainOfCustody(@Query('evidenceNumber') evidenceNumber?: string) {
    return this.forensicsService.getChainOfCustody(evidenceNumber);
  }

  @Post('custody')
  @ApiOperation({ summary: 'Record checkout, analysis or checkin chain-of-custody event' })
  addCustodyAction(
    @Body('evidenceNumber') evidenceNumber: string,
    @Body('action') action: string,
    @Body('purpose') purpose: string,
  ) {
    return this.forensicsService.addCustodyAction(evidenceNumber, action, purpose);
  }
}
