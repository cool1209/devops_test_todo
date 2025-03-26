import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { Todo } from './todo.schema';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly exchange = 'todo_events';

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      await this.connect();
      this.logger.log('RabbitMQ connection established');
    } catch (error) {
      this.logger.error(`Failed to connect to RabbitMQ: ${error.message}`, error.stack);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('RabbitMQ connection closed');
    } catch (error) {
      this.logger.error(`Error closing RabbitMQ connection: ${error.message}`, error.stack);
    }
  }

  private async connect() {
    try {
      const url = this.configService.get<string>('RABBITMQ_URL') || 'amqp://guest:guest@rabbitmq:5672';
      this.connection = await amqp.connect(url);
      
      this.connection.on('error', (error) => {
        this.logger.error(`RabbitMQ connection error: ${error.message}`, error.stack);
        this.reconnect();
      });
      
      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed, attempting to reconnect');
        this.reconnect();
      });
      
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
      
      this.logger.log(`RabbitMQ connected to ${url}`);
    } catch (error) {
      this.logger.error(`Failed to establish RabbitMQ connection: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async reconnect() {
    try {
      this.logger.log('Attempting to reconnect to RabbitMQ...');
      setTimeout(async () => {
        try {
          await this.connect();
          this.logger.log('Successfully reconnected to RabbitMQ');
        } catch (error) {
          this.logger.error(`Failed to reconnect to RabbitMQ: ${error.message}`, error.stack);
          this.reconnect();
        }
      }, 5000);
    } catch (error) {
      this.logger.error(`Error in RabbitMQ reconnection: ${error.message}`, error.stack);
    }
  }

  async publishTodoEvent(routingKey: string, todo: Todo) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      const content = Buffer.from(JSON.stringify({
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        timestamp: new Date().toISOString(),
      }));
      
      this.channel.publish(this.exchange, routingKey, content, {
        contentType: 'application/json',
        persistent: true,
      });
      
      this.logger.log(`Published message to ${this.exchange} with routing key ${routingKey}`);
    } catch (error) {
      this.logger.error(`Error publishing message: ${error.message}`, error.stack);
      await this.reconnect();
    }
  }
} 