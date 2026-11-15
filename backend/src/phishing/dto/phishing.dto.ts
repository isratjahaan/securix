import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class ScanPhishingDto {
  @ApiProperty({ example: 'https://secure-login-verify-account-update.xyz', description: 'URL or link to inspect' })
  @IsString()
  @IsNotEmpty()
  target: string;

  @ApiProperty({ example: 'URL', enum: ['URL', 'EMAIL_BODY', 'SMS_TEXT'], required: false })
  @IsOptional()
  @IsEnum(['URL', 'EMAIL_BODY', 'SMS_TEXT'])
  type?: 'URL' | 'EMAIL_BODY' | 'SMS_TEXT';

  @ApiProperty({ example: 'Urgent: Your corporate credentials expire in 2 hours. Verify now.', required: false })
  @IsOptional()
  @IsString()
  content?: string;
}

export class QuarantineActionDto {
  @ApiProperty({ example: 'Approved after manual SOC review' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
