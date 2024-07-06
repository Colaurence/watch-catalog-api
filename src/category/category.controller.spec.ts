import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      jest.spyOn(service, 'create').mockResolvedValue(mockCategory);
      const result = await controller.create(createCategoryDto);
      expect(result).toBe(mockCategory);
    });

    it('should handle errors during creation', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Vintage Watches' };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new HttpException('Error', HttpStatus.BAD_REQUEST));

      await expect(controller.create(createCategoryDto)).rejects.toThrow(
        HttpException,
      );
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

      jest.spyOn(service, 'findAll').mockResolvedValue({
        data: mockCategories,
        meta: {
          total: 1,
          lastPage: 1,
          currentPage: 1,
          perPage: 10,
          prev: null,
          next: null,
        },
      });
      const result = await controller.findAll(1, 10, '');
      expect(result.data).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toEqual('Sport Watches');
    });

    it('should handle errors during findAll', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new HttpException('Error', HttpStatus.BAD_REQUEST));

      await expect(controller.findAll(1, 10, '')).rejects.toThrow(
        HttpException,
      );
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

      jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);
      const result = await controller.findOne('cly8lr71f0000zp50p94q7rtb');
      expect(result).toBe(mockCategory);
    });

    it('should handle errors during findOne', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new HttpException('Error', HttpStatus.NOT_FOUND));

      await expect(
        controller.findOne('cly8lr71f0000zp50p94q7rtb'),
      ).rejects.toThrow(HttpException);
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

      jest.spyOn(service, 'update').mockResolvedValue(mockCategory);
      const result = await controller.update(
        'cly8lr71f0000zp50p94q7rtb',
        updateCategoryDto,
      );
      expect(result).toBe(mockCategory);
    });

    it('should handle errors during update', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Pilot Watches' };
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new HttpException('Error', HttpStatus.BAD_REQUEST));

      await expect(
        controller.update('cly8lr71f0000zp50p94q7rtb', updateCategoryDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a category successfully', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      await expect(
        controller.remove('cly8lr71f0000zp50p94q7rtb'),
      ).resolves.toBeUndefined();
    });

    it('should handle errors during remove', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new HttpException('Error', HttpStatus.BAD_REQUEST));

      await expect(
        controller.remove('cly8lr71f0000zp50p94q7rtb'),
      ).rejects.toThrow(HttpException);
    });
  });
});
