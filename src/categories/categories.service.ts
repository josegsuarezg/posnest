import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) : Promise<CreateCategoryDto | Category> {
    return await this.categoryRepository.save(createCategoryDto);
  }

  async findAll() : Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) : Promise<Category> {
    const category = await this.categoryRepository.findOneBy({id});
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) : Promise<Category>  {
    const category = await this.findOne(id);
    category.name = updateCategoryDto.name;
    return await this.categoryRepository.save(category);
  }

  async remove(id: number) : Promise<Category>{
    const category = await this.findOne(id);
    return await this.categoryRepository.remove(category);
  }
}
