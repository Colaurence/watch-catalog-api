import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BrandController', () => {
  let controller: BrandController;
  let service: BrandService;

  const mockCategoryId = 'cly8lr71f0000zp50p94q7rtb';
  const mockBrandId = 'cly8lr71f0000zp50p94q7rtc';
  const mockCategory = {
    id: mockCategoryId,
    name: 'Luxury Watches',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockBrand = {
    id: mockBrandId,
    name: 'Rolex',
    categoryId: mockCategoryId,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategory,
  };

  const mockBrands = {
    data: [mockBrand],
    meta: {
      total: 1,
      lastPage: 1,
      currentPage: 1,
      perPage: 10,
      prev: null,
      next: null,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        {
          provide: BrandService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBrand),
            findAll: jest.fn().mockResolvedValue(mockBrands),
            findOne: jest.fn().mockResolvedValue(mockBrand),
            update: jest.fn().mockResolvedValue(mockBrand),
            remove: jest.fn().mockResolvedValue(mockBrand),
          },
        },
      ],
    }).compile();

    controller = module.get<BrandController>(BrandController);
    service = module.get<BrandService>(BrandService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a brand successfully', async () => {
      const createBrandDto: CreateBrandDto = {
        name: 'Rolex',
        categoryId: mockCategoryId,
      };
      const result = await controller.create(createBrandDto);
      expect(result).toEqual(mockBrand);
      expect(service.create).toHaveBeenCalledWith(createBrandDto);
    });

    it('should handle errors during creation', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new HttpException('Error', HttpStatus.BAD_REQUEST),
        );
      const createBrandDto: CreateBrandDto = {
        name: 'Rolex',
        categoryId: mockCategoryId,
      };
      await expect(controller.create(createBrandDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of brands', async () => {
      const result = await controller.findAll(1, 10, '');
      expect(result).toEqual(mockBrands);
      expect(service.findAll).toHaveBeenCalledWith(
        { page: 1, perPage: 10 },
        '',
      );
    });

    it('should handle errors during findAll', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValueOnce(
          new HttpException('Error', HttpStatus.BAD_REQUEST),
        );
      await expect(controller.findAll(1, 10, '')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single brand', async () => {
      const result = await controller.findOne(mockBrandId);
      expect(result).toEqual(mockBrand);
      expect(service.findOne).toHaveBeenCalledWith(mockBrandId);
    });

    it('should handle errors during findOne', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(
          new HttpException('Brand not found', HttpStatus.NOT_FOUND),
        );
      await expect(controller.findOne(mockBrandId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('update', () => {
    it('should update a brand successfully', async () => {
      const updateBrandDto: UpdateBrandDto = { name: 'Updated Brand' };
      const result = await controller.update(mockBrandId, updateBrandDto);
      expect(result).toEqual(mockBrand);
      expect(service.update).toHaveBeenCalledWith(mockBrandId, updateBrandDto);
    });

    it('should handle errors during update', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(
          new HttpException('Brand not found', HttpStatus.NOT_FOUND),
        );
      const updateBrandDto: UpdateBrandDto = { name: 'Updated Brand' };
      await expect(
        controller.update(mockBrandId, updateBrandDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a brand successfully', async () => {
      const result = await controller.remove(mockBrandId);
      expect(result).toEqual(mockBrand);
      expect(service.remove).toHaveBeenCalledWith(mockBrandId);
    });

    it('should handle errors during remove', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(
          new HttpException('Brand not found', HttpStatus.NOT_FOUND),
        );
      await expect(controller.remove(mockBrandId)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
