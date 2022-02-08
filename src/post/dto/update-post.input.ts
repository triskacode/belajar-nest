import { CreatePostInput } from './create-post.input';
import { InputType, Field, PartialType, Int, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput extends PartialType(
  OmitType(CreatePostInput, ['userId']),
) {
  @Field(() => Int)
  id: number;
}
