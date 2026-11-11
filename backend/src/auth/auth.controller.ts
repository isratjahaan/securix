import { Controller, Post, Body, Get, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentication & Identity Gateway')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate administrator with credentials and optional MFA' })
  @ApiResponse({ status: 200, description: 'Authentication token or MFA challenge' })
  async login(@Body() body: { email: string; password?: string; mfaToken?: string }) {
    return this.authService.login(body);
  }

  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify 6-digit TOTP code for MFA challenge' })
  async verifyMfa(@Body() body: { tempToken: string; code: string }) {
    return this.authService.verifyMfa(body);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve currently authenticated administrator profile' })
  async getProfile(@Req() req: any) {
    return this.authService.getCurrentUser(req.user.userId);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke active session and log out' })
  async logout(@Req() req: any) {
    return { success: true, message: 'Session revoked successfully.' };
  }
}
