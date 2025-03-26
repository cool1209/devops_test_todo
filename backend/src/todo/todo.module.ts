import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './todo.schema';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { RabbitMQModule } from './rabbitmq.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
    ]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        store: redisStore,
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || 6379,
        ttl: 60,
      }),
      isGlobal: true,
    }),
    RabbitMQModule,
  ],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {} 