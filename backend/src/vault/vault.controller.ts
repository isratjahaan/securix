import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VaultService } from './vault.service';

@ApiTags('Vault Guardian Administration (Strict Zero-Knowledge)')
@Controller('vault')
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Get('metadata')
  @ApiOperation({ summary: 'Retrieve safe high-level vault metadata (Zero-Knowledge, never reveals secrets)' })
  getSafeMetadata() {
    return this.vaultService.getSafeMetadata();
  }

  @Get('recovery-requests')
  @ApiOperation({ summary: 'List cryptographic recovery escrow requests' })
  getRecoveryRequests() {
    return this.vaultService.getRecoveryRequests();
  }

  @Post('recovery-requests/:id/approve')
  @ApiOperation({ summary: 'Approve authorized zero-knowledge recovery shard release' })
  approveRecoveryRequest(@Param('id') id: string) {
    return this.vaultService.approveRecoveryRequest(id);
  }
}
