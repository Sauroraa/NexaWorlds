import { Controller, Get, Post, Body, Param, Req, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Votes')
@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  registerVote(@Req() req: any, @Body('site') site: string) {
    return this.votesService.registerVote(req.user.sub, site);
  }

  @Get('stats')
  getStats() {
    return this.votesService.getStats();
  }

  @Get('top')
  getTopVoters(@Query('limit') limit?: string) {
    return this.votesService.getTopVoters(Number(limit) || 10);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMyVotes(@Req() req: any) {
    return this.votesService.getUserVotes(req.user.sub);
  }

  @Post(':id/claim')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  claimReward(@Req() req: any, @Param('id') id: string) {
    return this.votesService.claimReward(req.user.sub, id);
  }
}
