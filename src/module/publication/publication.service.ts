import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from '../../shared/entities/publication.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private publicationRepo: Repository<Publication>,
  ) {}

  async create(dto: CreatePublicationDto, owner: User) {
    const publication = this.publicationRepo.create({ ...dto, owner });
    return this.publicationRepo.save(publication);
  }

  findAll() {
    return this.publicationRepo.find({
      relations: ['owner', 'posts'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const publication = await this.publicationRepo.findOne({
      where: { id },
      relations: ['owner', 'posts'],
    });
    if (!publication) throw new NotFoundException('Publication not found');
    return publication;
  }

  async update(id: string, dto: UpdatePublicationDto) {
    const publication = await this.findOne(id);
    Object.assign(publication, dto);
    return this.publicationRepo.save(publication);
  }

  async remove(id: string) {
    const publication = await this.findOne(id);
    return this.publicationRepo.remove(publication);
  }
}
