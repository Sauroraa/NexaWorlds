import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class VotesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async registerVote(userId: string, site: string) {
    const vote = await this.prisma.vote.create({
      data: { userId, site },
    });

    await this.redis.incr(`votes:monthly:${new Date().toISOString().slice(0, 7)}`);
    await this.redis.incr(`votes:user:${userId}`);

    return vote;
  }

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalVotes, monthlyVotes] = await Promise.all([
      this.prisma.vote.count(),
      this.prisma.vote.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    return { totalVotes, monthlyVotes };
  }

  async getTopVoters(limit = 10) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const topVoters = await this.prisma.vote.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: startOfMonth } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    const users = await this.prisma.user.findMany({
      where: { id: { in: topVoters.map((v) => v.userId) } },
      select: { id: true, username: true, uuid: true },
    });

    return topVoters.map((voter, index) => {
      const user = users.find((u) => u.id === voter.userId);
      return {
        rank: index + 1,
        username: user?.username || 'Unknown',
        uuid: user?.uuid || '',
        votes: voter._count.id,
      };
    });
  }

  async getUserVotes(userId: string) {
    const [total, monthly] = await Promise.all([
      this.prisma.vote.count({ where: { userId } }),
      this.prisma.vote.count({
        where: {
          userId,
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      }),
    ]);

    const lastVote = await this.prisma.vote.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return { total, monthly, lastVote: lastVote?.createdAt };
  }

  async claimReward(userId: string, voteId: string) {
    return this.prisma.vote.update({
      where: { id: voteId },
      data: { rewardClaimed: true },
    });
  }
}
