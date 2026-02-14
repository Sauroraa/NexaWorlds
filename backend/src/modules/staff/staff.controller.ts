import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { ApplicationStatus } from '@prisma/client';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  apply(@Req() req: any, @Body() body: any) {
    return this.staffService.apply(req.user.sub, body);
  }

  @Get('applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  findAll(@Query('status') status?: ApplicationStatus) {
    return this.staffService.findAll(status);
  }

  @Patch('applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  updateStatus(@Param('id') id: string, @Body('status') status: ApplicationStatus) {
    return this.staffService.updateStatus(id, status);
  }
}
