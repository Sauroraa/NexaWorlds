import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReputationService {
  constructor(private prisma: PrismaService) {}

  async getReputation(username: string) {
    let reputation = await this.prisma.reputation.findUnique({
      where: { username },
      include: {
        history: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!reputation) {
      // Create reputation record if not exists
      reputation = await this.prisma.reputation.create({
        data: {
          username,
          userId: `temp_${username}`,
          points: 0,
        },
        include: {
          history: true,
        },
      });
    }

    return reputation;
  }

  async addReputation(username: string, amount: number, reason: string, givenBy: string) {
    // Get or create reputation
    let reputation = await this.prisma.reputation.findUnique({
      where: { username },
    });

    if (!reputation) {
      reputation = await this.prisma.reputation.create({
        data: {
          username,
          userId: `temp_${username}`,
          points: amount,
          positive: amount,
        },
      });
    }

    // Add reputation
    const updated = await this.prisma.reputation.update({
      where: { username },
      data: {
        points: { increment: amount },
        positive: { increment: amount },
        totalGiven: { increment: amount },
        lastUpdated: new Date(),
      },
    });

    // Add history
    await this.prisma.reputationHistory.create({
      data: {
        userId: reputation.userId,
        amount,
        reason,
        givenBy,
        type: 'positive',
      },
    });

    return { newTotal: updated.points };
  }

  async removeReputation(username: string, amount: number, reason: string, removedBy: string) {
    const reputation = await this.prisma.reputation.findUnique({
      where: { username },
    });

    if (!reputation) {
      throw new Error('Reputation not found');
    }

    const actualAmount = Math.min(amount, reputation.points);

    // Remove reputation
    const updated = await this.prisma.reputation.update({
      where: { username },
      data: {
        points: { decrement: actualAmount },
        negative: { increment: actualAmount },
        lastUpdated: new Date(),
      },
    });

    // Add history
    await this.prisma.reputationHistory.create({
      data: {
        userId: reputation.userId,
        amount: -actualAmount,
        reason,
        givenBy: removedBy,
        type: 'negative',
      },
    });

    return { newTotal: updated.points };
  }

  async getLeaderboard(limit: number) {
    return this.prisma.reputation.findMany({
      orderBy: { points: 'desc' },
      take: limit,
      select: {
        username: true,
        points: true,
        positive: true,
        negative: true,
      },
    });
  }
}
