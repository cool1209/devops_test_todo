import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.schema';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { RabbitMQService } from './rabbitmq.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);
  private readonly CACHE_KEY = 'todos';

  constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private rabbitMQService: RabbitMQService,
  ) {}

  async findAll(): Promise<Todo[]> {
    try {
      const cachedTodos = await this.cacheManager.get<Todo[]>(this.CACHE_KEY);
      if (cachedTodos) {
        this.logger.log('Retrieved todos from cache');
        return cachedTodos;
      }

      const todos = await this.todoModel.find().exec();
      
      await this.cacheManager.set(this.CACHE_KEY, todos, 60000);
      
      this.logger.log('Retrieved todos from database and cached');
      return todos;
    } catch (error) {
      this.logger.error(`Error finding todos: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Todo | null> {
    try {
      const todo = await this.todoModel.findById(id).exec();
      this.logger.log(`Retrieved todo with ID: ${id}`);
      return todo;
    } catch (error) {
      this.logger.error(`Error finding todo with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(createTodoInput: CreateTodoInput): Promise<Todo> {
    try {
      const newTodo = new this.todoModel(createTodoInput);
      const savedTodo = await newTodo.save();
      
      await this.cacheManager.del(this.CACHE_KEY);
      
      await this.rabbitMQService.publishTodoEvent('todo.created', savedTodo);
      
      this.logger.log(`Created todo with ID: ${savedTodo._id}`);
      return savedTodo;
    } catch (error) {
      this.logger.error(`Error creating todo: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateTodoInput: UpdateTodoInput): Promise<Todo | null> {
    try {
      const updatedTodo = await this.todoModel
        .findByIdAndUpdate(id, updateTodoInput, { new: true })
        .exec();
      
      if (!updatedTodo) {
        this.logger.warn(`Todo with ID ${id} not found for update`);
        return null;
      }
      
      await this.cacheManager.del(this.CACHE_KEY);
      
      await this.rabbitMQService.publishTodoEvent('todo.updated', updatedTodo);
      
      this.logger.log(`Updated todo with ID: ${id}`);
      return updatedTodo;
    } catch (error) {
      this.logger.error(`Error updating todo with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<Todo | null> {
    try {
      const deletedTodo = await this.todoModel.findByIdAndDelete(id).exec();
      
      if (!deletedTodo) {
        this.logger.warn(`Todo with ID ${id} not found for deletion`);
        return null;
      }
      
      await this.cacheManager.del(this.CACHE_KEY);
      
      await this.rabbitMQService.publishTodoEvent('todo.deleted', deletedTodo);
      
      this.logger.log(`Deleted todo with ID: ${id}`);
      return deletedTodo;
    } catch (error) {
      this.logger.error(`Error deleting todo with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 