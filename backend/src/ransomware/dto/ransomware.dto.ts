import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class TripwireTestDto {
  @ApiProperty({ example: 'CANARY-FINANCE-01.docx', description: 'Canary decoy identifier or simulated path' })
  @IsString()
  @IsNotEmpty()
  canaryId: string;

  @ApiProperty({ example: 8.12, description: 'Simulated file stream Shannon entropy', required: false })
  @IsOptional()
  @IsNumber()
  simulatedEntropy?: number;
}

export class IsolateHostDto {
  @ApiProperty({ example: '10.0.2.16', description: 'Target endpoint IP or Device ID to isolate' })
  @IsString()
  @IsNotEmpty()
  hostIdentifier: string;

  @ApiProperty({ example: 'Active LockBit 3.0 behavioral signature detected' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
