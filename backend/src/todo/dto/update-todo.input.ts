import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

@InputType()
export class UpdateTodoInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
} 