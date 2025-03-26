import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@ObjectType()
@Schema({ timestamps: false })
export class Todo extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field()
  @Prop({ default: false })
  completed: boolean;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: () => new Date().toISOString() })
  createdAt: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: () => new Date().toISOString() })
  updatedAt: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

TodoSchema.pre('save', function(next) {
  const now = new Date().toISOString();
  
  if (!this.createdAt) {
    this.createdAt = now;
  }
  
  this.updatedAt = now;
  
  next();
});

TodoSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date().toISOString() });
  next();
}); 