import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, PrismaService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Luxury Watches' };
      const mockCategory = {
        id: 'cly8lr71f0000zp50p94q7rtb',
        name: 'Luxury Watches',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.category, 'create').mockResolvedValue(mockCategory);
      const result = await service.create(createCategoryDto);
      expect(result).toBeDefined();
      expect(result.name).toEqual('Luxury Watches');
    });

    it('should handle errors during creation', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Vintage Watches' };
      jest
        .spyOn(prisma.category, 'create')
        .mockRejectedValue(new Error('Error'));
      await expect(service.create(createCategoryDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return a list of categories', async () => {
      const mockCategories = [
        {
          id: 'cly8lr71f0000zp50p94q7rtb',
          name: 'Sport Watches',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.category, 'findMany').mockResolvedValue(mockCategories);
      const result = await service.findAll();
      expect(result.data).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toEqual('Sport Watches');
    });

    it('should handle errors during findAll', async () => {
      jest
        .spyOn(prisma.category, 'findMany')
        .mockRejectedValue(new Error('Error'));
      await expect(service.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      const mockCategory = {
        id: 'cly8lr71f0000zp50p94q7rtb',
        name: 'Dive Watches',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prisma.category, 'findUniqueOrThrow')
        .mockResolvedValue(mockCategory);
      const result = await service.findOne('cly8lr71f0000zp50p94q7rtb');
      expect(result).toBeDefined();
      expect(result.name).toEqual('Dive Watches');
    });

    it('should handle errors during findOne', async () => {
      jest
        .spyOn(prisma.category, 'findUniqueOrThrow')
        .mockRejectedValue(new Error('Error'));
      await expect(
        service.findOne('cly8lr71f0000zp50p94q7rtb'),
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Classic Watches' };
      const mockCategory = {
        id: 'cly8lr71f0000zp50p94q7rtb',
        name: 'Classic Watches',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.category, 'update').mockResolvedValue(mockCategory);
      const result = await service.update(
        'cly8lr71f0000zp50p94q7rtb',
        updateCategoryDto,
      );
      expect(result).toBeDefined();
      expect(result.name).toEqual('Classic Watches');
    });

    it('should handle errors during update', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Pilot Watches' };
      jest
        .spyOn(prisma.category, 'update')
        .mockRejectedValue(new Error('Error'));
      await expect(
        service.update('cly8lr71f0000zp50p94q7rtb', updateCategoryDto),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a category successfully', async () => {
      const mockCategory = {
        id: 'cly8lr71f0000zp50p94q7rtb',
        name: 'Field Watches',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.category, 'delete').mockResolvedValue(mockCategory);
      await expect(
        service.remove('cly8lr71f0000zp50p94q7rtb'),
      ).resolves.toBeUndefined();
    });

    it('should handle errors during remove', async () => {
      jest
        .spyOn(prisma.category, 'delete')
        .mockRejectedValue(new Error('Error'));
      await expect(
        service.remove('cly8lr71f0000zp50p94q7rtb'),
      ).rejects.toThrow();
    });
  });
});
