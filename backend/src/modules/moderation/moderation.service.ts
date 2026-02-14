import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async addWarning(data: {
    userId: string;
    reason: string;
    issuedBy: string;
    type?: string;
    duration?: string;
  }) {
    const warning = await this.prisma.warning.create({
      data: {
        userId: data.userId,
        type: (data.type as any) || 'warn',
        reason: data.reason,
        issuedBy: data.issuedBy,
        duration: data.duration,
      },
    });

    // Get total warnings for this user
    const totalWarnings = await this.prisma.warning.count({
      where: { userId: data.userId, active: true },
    });

    return { ...warning, totalWarnings };
  }

  async getWarnings(userId: string) {
    return this.prisma.warning.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async logAction(data: {
    userId: string;
    type: string;
    reason: string;
    issuedBy: string;
    duration?: string;
  }) {
    return this.prisma.warning.create({
      data: {
        userId: data.userId,
        discordId: data.userId,
        type: data.type as any,
        reason: data.reason,
        issuedBy: data.issuedBy,
        duration: data.duration,
        active: true,
      },
    });
  }

  async getLogs(userId: string) {
    return this.prisma.warning.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async deactivateWarning(warningId: string) {
    return this.prisma.warning.update({
      where: { id: warningId },
      data: { active: false },
    });
  }

  async getActiveBans() {
    return this.prisma.warning.findMany({
      where: { type: 'ban', active: true },
    });
  }

  async getActiveMutes() {
    return this.prisma.warning.findMany({
      where: { type: 'mute', active: true },
    });
  }
}
