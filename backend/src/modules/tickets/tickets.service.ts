import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async createTicket(data: {
    userId: string;
    channelId: string;
    category: string;
    subject: string;
    description: string;
  }) {
    return this.prisma.ticket.create({
      data: {
        userId: data.userId,
        channelId: data.channelId,
        category: data.category,
        subject: data.subject,
        status: 'open',
        priority: 'normal',
        messages: {
          create: {
            authorId: data.userId,
            authorName: 'System',
            content: data.description,
            isStaff: false,
          },
        },
      },
      include: {
        messages: true,
      },
    });
  }

  async getTickets() {
    return this.prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    });
  }

  async getTicket(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async getTicketByChannelId(channelId: string) {
    return this.prisma.ticket.findUnique({
      where: { channelId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async closeTicket(channelId: string, closedBy: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { channelId },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'closed',
        closedAt: new Date(),
        closedBy,
      },
    });
  }

  async addMessage(ticketId: string, data: {
    authorId: string;
    authorName: string;
    content: string;
    isStaff: boolean;
  }) {
    return this.prisma.ticketMessage.create({
      data: {
        ticketId,
        authorId: data.authorId,
        authorName: data.authorName,
        content: data.content,
        isStaff: data.isStaff,
      },
    });
  }

  async getOpenTicketCount() {
    return this.prisma.ticket.count({
      where: { status: 'open' },
    });
  }

  async getResolvedTicketCount() {
    return this.prisma.ticket.count({
      where: { status: 'closed' },
    });
  }
}
