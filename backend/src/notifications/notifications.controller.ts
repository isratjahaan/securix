import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notification Center & Multi-Channel Dispatch')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('unread')
  @ApiOperation({ summary: 'Retrieve unread in-app alerts and notifications' })
  getUnreadNotifications() {
    return this.notificationsService.getUnreadNotifications();
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notification items as read' })
  markAllRead() {
    return this.notificationsService.markAllRead();
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Retrieve notification routing preferences' })
  getPreferences() {
    return this.notificationsService.getPreferences();
  }
}
