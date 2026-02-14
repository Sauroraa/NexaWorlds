import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServersModule } from './modules/servers/servers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { VotesModule } from './modules/votes/votes.module';
import { StaffModule } from './modules/staff/staff.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { ReputationModule } from './modules/reputation/reputation.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { RecruitmentModule } from './modules/recruitment/recruitment.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ServersModule,
    OrdersModule,
    VotesModule,
    StaffModule,
    WebhooksModule,
    TicketsModule,
    ReputationModule,
    ModerationModule,
    RecruitmentModule,
  ],
})
export class AppModule {}
