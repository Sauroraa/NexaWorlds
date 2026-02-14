import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ModerationService } from './moderation.service';

@Controller('api/moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('warnings')
  async addWarning(@Body() body: {
    userId: string;
    reason: string;
    issuedBy: string;
    type?: string;
  }) {
    return this.moderationService.addWarning({
      userId: body.userId,
      reason: body.reason,
      issuedBy: body.issuedBy,
      type: body.type || 'warn',
    });
  }

  @Get('warnings/:userId')
  async getWarnings(@Param('userId') userId: string) {
    return this.moderationService.getWarnings(userId);
  }

  @Post('logs')
  async logAction(@Body() body: {
    userId: string;
    type: string;
    reason: string;
    issuedBy: string;
    duration?: string;
  }) {
    return this.moderationService.logAction(body);
  }

  @Get('logs/:userId')
  async getLogs(@Param('userId') userId: string) {
    return this.moderationService.getLogs(userId);
  }
}
