import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from './brand.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { brandTransform } from './transformer/brand.transformer';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BrandService', () => {
  let service: BrandService;
  let prismaService: PrismaService;

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
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: mockCategoryId,
    category: mockCategory,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: PrismaService,
          useValue: {
            brand: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a brand successfully', async () => {
      const createBrandDto: CreateBrandDto = {
        name: 'Rolex',
        categoryId: mockCategoryId,
      };

      jest.spyOn(prismaService.brand, 'create').mockResolvedValue(mockBrand);
      const result = await service.create(createBrandDto);
      expect(result).toEqual(brandTransform(mockBrand));
    });

    it('should handle errors during creation', async () => {
      const createBrandDto: CreateBrandDto = {
        name: 'Rolex',
        categoryId: mockCategoryId,
      };
      jest
        .spyOn(prismaService.brand, 'create')
        .mockRejectedValue(
          new HttpException('Brand already exists', HttpStatus.BAD_REQUEST),
        );
      await expect(service.create(createBrandDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of brands', async () => {
      const mockBrands = [mockBrand];
      const mockPaginatedResult = {
        data: mockBrands.map(brandTransform),
        meta: {
          total: 1,
          lastPage: 1,
          currentPage: 1,
          perPage: 10,
          prev: null,
          next: null,
        },
      };

      jest.spyOn(prismaService.brand, 'findMany').mockResolvedValue(mockBrands);
      jest.spyOn(prismaService.brand, 'count').mockResolvedValue(1);

      const result = await service.findAll({ page: 1, perPage: 10 }, '');
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle errors during findAll', async () => {
      jest
        .spyOn(prismaService.brand, 'findMany')
        .mockRejectedValue(new HttpException('Error', HttpStatus.BAD_REQUEST));
      await expect(
        service.findAll({ page: 1, perPage: 10 }, ''),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a single brand', async () => {
      jest
        .spyOn(prismaService.brand, 'findUniqueOrThrow')
        .mockResolvedValue(mockBrand);
      const result = await service.findOne(mockBrandId);
      expect(result).toEqual(brandTransform(mockBrand));
    });

    it('should handle errors during findOne', async () => {
      jest
        .spyOn(prismaService.brand, 'findUniqueOrThrow')
        .mockRejectedValue(
          new HttpException('Brand does not exist', HttpStatus.NOT_FOUND),
        );
      await expect(service.findOne(mockBrandId)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a brand successfully', async () => {
      const updateBrandDto: UpdateBrandDto = { name: 'Updated Brand' };
      const updatedMockBrand = { ...mockBrand, ...updateBrandDto };

      jest
        .spyOn(prismaService.brand, 'update')
        .mockResolvedValue(updatedMockBrand);
      const result = await service.update(mockBrandId, updateBrandDto);
      expect(result).toEqual(brandTransform(updatedMockBrand));
    });

    it('should handle errors during update', async () => {
      const updateBrandDto: UpdateBrandDto = { name: 'Updated Brand' };
      jest
        .spyOn(prismaService.brand, 'update')
        .mockRejectedValue(
          new HttpException('Brand does not exist', HttpStatus.BAD_REQUEST),
        );
      await expect(service.update(mockBrandId, updateBrandDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a brand successfully', async () => {
      jest.spyOn(prismaService.brand, 'delete').mockResolvedValue(mockBrand);
      const result = await service.remove(mockBrandId);
      expect(result).toEqual(brandTransform(mockBrand));
    });

    it('should handle errors during remove', async () => {
      jest
        .spyOn(prismaService.brand, 'delete')
        .mockRejectedValue(
          new HttpException('Brand does not exist', HttpStatus.BAD_REQUEST),
        );
      await expect(service.remove(mockBrandId)).rejects.toThrow(HttpException);
    });
  });
});
