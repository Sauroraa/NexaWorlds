import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async apply(userId: string, data: {
    username: string;
    age: number;
    discord: string;
    experience: string;
    motivation: string;
    availability: string;
    skills?: string;
  }) {
    const score = this.calculateScore(data);

    return this.prisma.staffApplication.create({
      data: {
        userId,
        username: data.username,
        age: data.age,
        discord: data.discord,
        experience: data.experience,
        motivation: data.motivation,
        availability: data.availability,
        skills: data.skills,
        score,
      },
    });
  }

  private calculateScore(data: { age: number; experience: string; motivation: string; availability: string }): number {
    let score = 0;

    if (data.age >= 16) score += 20;
    else if (data.age >= 14) score += 10;

    if (data.experience.length > 200) score += 25;
    else if (data.experience.length > 100) score += 15;
    else score += 5;

    if (data.motivation.length > 200) score += 25;
    else if (data.motivation.length > 100) score += 15;
    else score += 5;

    if (data.availability.length > 50) score += 15;
    else score += 5;

    return Math.min(score, 100);
  }

  async findAll(status?: ApplicationStatus) {
    return this.prisma.staffApplication.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: ApplicationStatus) {
    const app = await this.prisma.staffApplication.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Candidature non trouvée');

    return this.prisma.staffApplication.update({
      where: { id },
      data: { status },
    });
  }
}
