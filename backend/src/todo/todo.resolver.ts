import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { Logger } from '@nestjs/common';

@Resolver(() => Todo)
export class TodoResolver {
  private readonly logger = new Logger(TodoResolver.name);

  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], { name: 'todos' })
  async findAll(): Promise<Todo[]> {
    this.logger.log('GraphQL Query: todos');
    return this.todoService.findAll();
  }

  @Query(() => Todo, { name: 'todo', nullable: true })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Todo | null> {
    this.logger.log(`GraphQL Query: todo with id ${id}`);
    const todo = await this.todoService.findOne(id);
    return todo || null;
  }

  @Mutation(() => Todo, { name: 'createTodo' })
  async create(@Args('createTodoInput') createTodoInput: CreateTodoInput): Promise<Todo> {
    this.logger.log(`GraphQL Mutation: createTodo with title ${createTodoInput.title}`);
    return this.todoService.create(createTodoInput);
  }

  @Mutation(() => Todo, { name: 'updateTodo', nullable: true })
  async update(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput): Promise<Todo | null> {
    this.logger.log(`GraphQL Mutation: updateTodo with id ${updateTodoInput.id}`);
    const updatedTodo = await this.todoService.update(updateTodoInput.id, updateTodoInput);
    return updatedTodo || null;
  }

  @Mutation(() => Todo, { name: 'deleteTodo', nullable: true })
  async remove(@Args('id', { type: () => ID }) id: string): Promise<Todo | null> {
    this.logger.log(`GraphQL Mutation: deleteTodo with id ${id}`);
    const deletedTodo = await this.todoService.remove(id);
    return deletedTodo || null;
  }
} 