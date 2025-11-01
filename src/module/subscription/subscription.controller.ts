import { Controller, Post, Delete, Get, Body, Param, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.subscribe(dto);
  }

  @Delete()
  cancel(@Body() dto: CancelSubscriptionDto) {
    return this.subscriptionService.cancel(dto);
  }

  @Get(':type/:id/subscribers')
  getSubscribers(
    @Param('type') type: 'USER' | 'PUBLICATION',
    @Param('id') id: string,
  ) {
    return this.subscriptionService.getSubscribers(type, id);
  }

  @Get(':userId')
  getUserSubscriptions(@Param('userId') userId: string) {
    return this.subscriptionService.getUserSubscriptions(userId);
  }
}
