import { Controller, Get, Post, Param, Body, Patch, ParseUUIDPipe } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';

@Controller('api/recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Post('apply')
  async submitApplication(@Body() body: {
    discord: string;
    age: number;
    experience: string;
    motivation: string;
    disponibilite: string;
    userId: string;
    skills?: string;
  }) {
    return this.recruitmentService.submitApplication(body);
  }

  @Get('user/:userId')
  async getApplicationByUser(@Param('userId') userId: string) {
    return this.recruitmentService.getApplicationByUser(userId);
  }

  @Get('all')
  async getAllApplications() {
    return this.recruitmentService.getAllApplications();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: string },
  ) {
    return this.recruitmentService.updateStatus(id, body.status);
  }

  @Post(':id/score')
  async addScore(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { criteria: string; score: number; notes?: string; evaluatedBy: string },
  ) {
    return this.recruitmentService.addScore(id, body);
  }
}
