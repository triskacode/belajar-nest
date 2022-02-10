import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostInput: CreatePostInput): Promise<Post> {
    return await this.postRepository.save<Post>(createPostInput);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    return await this.postRepository.findOneOrFail(id);
  }

  async update(id: number, updatePostInput: UpdatePostInput): Promise<Post> {
    const post = await this.postRepository.findOneOrFail(id);

    post.title = updatePostInput.title ?? post.title;
    post.content = updatePostInput.content ?? post.content;
    post.userId = updatePostInput.userId ?? post.userId;

    return await this.postRepository.save<Post>(post);
  }

  async remove(id: number): Promise<Post> {
    const post = await this.postRepository.findOneOrFail(id);

    return await this.postRepository.remove(post);
  }
}
