import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ReputationService } from './reputation.service';

@Controller('api/reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  @Get(':username')
  async getReputation(@Param('username') username: string) {
    return this.reputationService.getReputation(username);
  }

  @Post('add')
  async addReputation(@Body() body: {
    username: string;
    amount: number;
    reason: string;
    givenBy: string;
  }) {
    return this.reputationService.addReputation(
      body.username,
      body.amount,
      body.reason,
      body.givenBy,
    );
  }

  @Post('remove')
  async removeReputation(@Body() body: {
    username: string;
    amount: number;
    reason: string;
    removedBy: string;
  }) {
    return this.reputationService.removeReputation(
      body.username,
      body.amount,
      body.reason,
      body.removedBy,
    );
  }

  @Get('leaderboard/:limit')
  async getLeaderboard(@Param('limit') limit: string) {
    return this.reputationService.getLeaderboard(parseInt(limit) || 10);
  }
}
