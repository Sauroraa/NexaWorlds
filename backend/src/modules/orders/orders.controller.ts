import { Controller, Post, Get, Body, Req, UseGuards, Headers, RawBodyRequest, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Request } from 'express';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createCheckout(@Req() req: any, @Body() body: { items: any[] }) {
    return this.ordersService.createCheckout(req.user.sub, body.items);
  }

  @Post('webhook')
  handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.ordersService.handleWebhook(req.rawBody!, signature);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMyOrders(@Req() req: any) {
    return this.ordersService.findByUser(req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  findAll(@Query('page') page?: string) {
    return this.ordersService.findAll(Number(page) || 1);
  }
}
