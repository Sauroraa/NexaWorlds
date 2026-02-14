import { Controller, Get, Post, Patch, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async createTicket(@Body() createTicketDto: {
    userId: string;
    channelId: string;
    category: string;
    subject: string;
    description: string;
  }) {
    return this.ticketsService.createTicket(createTicketDto);
  }

  @Get()
  async getTickets() {
    return this.ticketsService.getTickets();
  }

  @Get(':id')
  async getTicket(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketsService.getTicket(id);
  }

  @Patch('close/:channelId')
  async closeTicket(
    @Param('channelId') channelId: string,
    @Body() body: { closedBy: string },
  ) {
    return this.ticketsService.closeTicket(channelId, body.closedBy);
  }

  @Post(':id/messages')
  async addMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addMessageDto: {
      authorId: string;
      authorName: string;
      content: string;
      isStaff: boolean;
    },
  ) {
    return this.ticketsService.addMessage(id, addMessageDto);
  }
}
