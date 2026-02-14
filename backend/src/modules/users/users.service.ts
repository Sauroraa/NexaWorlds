import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: { id: true, username: true, email: true, uuid: true, role: true, reputation: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, uuid: true, role: true, reputation: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, email: true, uuid: true, role: true, reputation: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  async updateRole(id: string, role: UserRole) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, username: true, role: true },
    });
  }

  async updateReputation(id: string, amount: number) {
    return this.prisma.user.update({
      where: { id },
      data: { reputation: { increment: amount } },
    });
  }

  async getStats(id: string) {
    const [orders, votes] = await Promise.all([
      this.prisma.order.count({ where: { userId: id, status: 'completed' } }),
      this.prisma.vote.count({ where: { userId: id } }),
    ]);
    return { totalOrders: orders, totalVotes: votes };
  }
}
