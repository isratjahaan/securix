import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssetsService } from './assets.service';

@ApiTags('Asset Registry & Authorized Perimeter Inventory')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'List websites, domains, IP networks and environments' })
  getAssets(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.assetsService.getAssets({ type, status, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset details, scan authorization status and linked alerts' })
  getAssetById(@Param('id') id: string) {
    return this.assetsService.getAssetById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register new asset with authorization documentation' })
  createAsset(@Body() body: any) {
    return this.assetsService.createAsset(body);
  }

  @Patch(':id/authorize')
  @ApiOperation({ summary: 'Verify and grant explicit security assessment authorization' })
  verifyAuthorization(@Param('id') id: string, @Body('proofDocumentId') proofDocumentId: string) {
    return this.assetsService.verifyAuthorization(id, proofDocumentId);
  }
}
