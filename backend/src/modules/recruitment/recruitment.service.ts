import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecruitmentService {
  constructor(private prisma: PrismaService) {}

  async submitApplication(data: {
    discord: string;
    age: number;
    experience: string;
    motivation: string;
    disponibilite: string;
    userId: string;
    skills?: string;
  }) {
    // Check if user already has a pending application
    const existing = await this.prisma.staffApplication.findFirst({
      where: {
        userId: data.userId,
        status: { in: ['pending', 'interview'] },
      },
    });

    if (existing) {
      throw new Error('Vous avez deja une candidature en cours');
    }

    // Auto-calculate score based on experience
    const experienceWords = data.experience.split(' ').length;
    const motivationWords = data.motivation.split(' ').length;
    const baseScore = Math.min(50, experienceWords * 2 + motivationWords);

    return this.prisma.staffApplication.create({
      data: {
        userId: data.userId,
        username: data.discord,
        age: data.age,
        discord: data.discord,
        experience: data.experience,
        motivation: data.motivation,
        availability: data.disponibilite,
        skills: data.skills,
        score: baseScore,
        status: 'pending',
      },
    });
  }

  async getApplicationByUser(userId: string) {
    return this.prisma.staffApplication.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllApplications() {
    return this.prisma.staffApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(applicationId: string, status: string) {
    return this.prisma.staffApplication.update({
      where: { id: applicationId },
      data: { status: status as any },
    });
  }

  async addScore(applicationId: string, data: {
    criteria: string;
    score: number;
    notes?: string;
    evaluatedBy: string;
  }) {
    // Get application data
    const application = await this.prisma.staffApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    await this.prisma.recruitmentScore.create({
      data: {
        applicationId,
        userId: application.userId,
        username: application.username,
        discordId: application.discord,
        criteria: data.criteria,
        score: data.score,
        notes: data.notes,
        evaluatedBy: data.evaluatedBy,
      },
    });

    // Update total score
    const scores = await this.prisma.recruitmentScore.findMany({
      where: { applicationId },
    });

    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

    return this.prisma.staffApplication.update({
      where: { id: applicationId },
      data: { score: totalScore },
    });
  }

  async getPendingCount() {
    return this.prisma.staffApplication.count({
      where: { status: 'pending' },
    });
  }
}
