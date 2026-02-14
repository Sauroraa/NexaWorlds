import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import Stripe from 'stripe';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
}

@Injectable()
export class OrdersService {
  private stripe: Stripe;
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createCheckout(userId: string, items: CartItem[]) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CORS_ORIGIN}/boutique?success=true`,
      cancel_url: `${process.env.CORS_ORIGIN}/boutique?canceled=true`,
      metadata: { userId },
    });

    await this.prisma.order.create({
      data: {
        userId,
        items: JSON.parse(JSON.stringify(items)),
        total,
        stripeSessionId: session.id,
        status: 'pending',
      },
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      await this.prisma.order.update({
        where: { stripeSessionId: session.id },
        data: {
          status: 'completed',
          stripePaymentId: session.payment_intent as string,
        },
      });

      this.logger.log(`Order completed: ${session.id}`);
    }

    return { received: true };
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        include: { user: { select: { username: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);
    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  }
}
