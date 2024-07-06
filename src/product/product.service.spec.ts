import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencyGateway } from '../gateway/currency-conversion/currency.gateway';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let prismaService: PrismaService;
  let currencyGateway: CurrencyGateway;

  const mockProduct = {
    id: 'cly8lr71f0000zp50p94q7rtb',
    name: 'Rolex Submariner',
    brandId: 'cly8lr71f0000zp50p94q7rtc',
    description: 'A classic diving watch with a timeless design.',
    refNo: '123456-7890',
    thumbnailUrl: 'http://example.com/rolex-submariner.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: {
      id: 'cly8lr71f0000zp50p94q7rtc',
      name: 'Rolex',
      categoryId: 'cly8lr71f0000zp50p94q7rtd',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    listings: [],
  };

  const updatedProduct = {
    ...mockProduct,
    name: 'Rolex Submariner Date',
    description:
      'An updated version of the classic diving watch with a date function.',
    thumbnailUrl: 'http://example.com/rolex-submariner-date.jpg',
  };

  const mockPaginatedResult = {
    data: [mockProduct],
    meta: {
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      next: null,
      prev: null,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn().mockResolvedValue(mockProduct),
              findMany: jest.fn().mockResolvedValue([mockProduct]),
              findUniqueOrThrow: jest.fn().mockResolvedValue(mockProduct),
              update: jest.fn().mockResolvedValue(updatedProduct),
              delete: jest.fn().mockResolvedValue(mockProduct),
              count: jest.fn().mockResolvedValue(1),
            },
          },
        },
        {
          provide: CurrencyGateway,
          useValue: {
            getExchangeRate: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    currencyGateway = module.get<CurrencyGateway>(CurrencyGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Rolex Submariner',
        brandId: 'cly8lr71f0000zp50p94q7rtc',
        description: 'A classic diving watch with a timeless design.',
        thumbnailUrl: 'http://example.com/rolex-submariner.jpg',
      };

      const result = await service.create(createProductDto);
      expect(result.refNo).toMatch('123456-7890');
      expect(result.name).toBe(createProductDto.name);
      expect(result.brand.id).toBe(createProductDto.brandId);
      expect(result.description).toBe(createProductDto.description);
      expect(result.thumbnailUrl).toBe(createProductDto.thumbnailUrl);
    });

    it('should handle errors during creation', async () => {
      jest
        .spyOn(prismaService.product, 'create')
        .mockRejectedValue(new Error('Creation failed'));
      const createProductDto: CreateProductDto = {
        name: 'Rolex Submariner',
        brandId: 'cly8lr71f0000zp50p94q7rtc',
        description: 'A classic diving watch with a timeless design.',
        thumbnailUrl: 'http://example.com/rolex-submariner.jpg',
      };

      await expect(service.create(createProductDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should generate a reference number for the product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Rolex Submariner',
        brandId: 'cly8lr71f0000zp50p94q7rtc',
        description: 'A classic diving watch with a timeless design.',
        thumbnailUrl: 'http://example.com/rolex-submariner.jpg',
      };

      const result = await service.create(createProductDto);
      expect(result.refNo).toMatch('123456-7890');
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const result = await service.findAll({ page: 1, perPage: 10 }, '', '');
      expect(result).toBeInstanceOf(Object);
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('description');
      expect(result.data[0]).toHaveProperty('thumbnailUrl');
      expect(result.meta).toEqual(mockPaginatedResult.meta);
    });

    it('should handle errors during findAll', async () => {
      jest
        .spyOn(prismaService.product, 'findMany')
        .mockRejectedValue(new Error('FindAll failed'));
      await expect(
        service.findAll({ page: 1, perPage: 10 }, '', ''),
      ).rejects.toThrow(HttpException);
    });

    it('should convert prices to the specified currency', async () => {
      jest.spyOn(currencyGateway, 'getExchangeRate').mockResolvedValueOnce(1.2);
      const result = await service.findAll(
        { page: 1, perPage: 10 },
        '',
        '',
        'USD',
      );
      expect(result.data[0].listings).toEqual(mockProduct.listings);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = await service.findOne('cly8lr71f0000zp50p94q7rtb');
      expect(result).toMatchObject({
        name: mockProduct.name,
        description: mockProduct.description,
        thumbnailUrl: mockProduct.thumbnailUrl,
      });
    });

    it('should handle errors during findOne', async () => {
      jest
        .spyOn(prismaService.product, 'findUniqueOrThrow')
        .mockRejectedValue(new Error('FindOne failed'));
      await expect(
        service.findOne('cly8lr71f0000zp50p94q7rtb'),
      ).rejects.toThrow(HttpException);
    });

    it('should convert prices to the specified currency', async () => {
      jest.spyOn(currencyGateway, 'getExchangeRate').mockResolvedValueOnce(1.2);
      const result = await service.findOne('cly8lr71f0000zp50p94q7rtb', 'USD');
      expect(result.listings).toEqual(mockProduct.listings);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Rolex Submariner Date',
        description:
          'An updated version of the classic diving watch with a date function.',
        thumbnailUrl: 'http://example.com/rolex-submariner-date.jpg',
      };

      const result = await service.update(
        'cly8lr71f0000zp50p94q7rtb',
        updateProductDto,
      );
      expect(result).toMatchObject({
        name: updateProductDto.name,
        description: updateProductDto.description,
        thumbnailUrl: updateProductDto.thumbnailUrl,
      });
    });

    it('should handle errors during update', async () => {
      jest
        .spyOn(prismaService.product, 'update')
        .mockRejectedValue(new Error('Update failed'));
      const updateProductDto: UpdateProductDto = {
        name: 'Rolex Submariner Date',
        description:
          'An updated version of the classic diving watch with a date function.',
        thumbnailUrl: 'http://example.com/rolex-submariner-date.jpg',
      };

      await expect(
        service.update('cly8lr71f0000zp50p94q7rtb', updateProductDto),
      ).rejects.toThrow(HttpException);
    });

    it('should not update the refNo', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Rolex Submariner Date',
        description:
          'An updated version of the classic diving watch with a date function.',
        thumbnailUrl: 'http://example.com/rolex-submariner-date.jpg',
      };

      const result = await service.update(
        'cly8lr71f0000zp50p94q7rtb',
        updateProductDto,
      );
      expect(result.refNo).toEqual(mockProduct.refNo);
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      const result = await service.remove('cly8lr71f0000zp50p94q7rtb');
      expect(result).toBeUndefined();
    });

    it('should handle errors during remove', async () => {
      jest
        .spyOn(prismaService.product, 'delete')
        .mockRejectedValue(new Error('Delete failed'));
      await expect(service.remove('cly8lr71f0000zp50p94q7rtb')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if the product does not exist', async () => {
      jest
        .spyOn(prismaService.product, 'delete')
        .mockRejectedValue(new Error('Failed to delete product'));
      await expect(service.remove('non-existent-prod-id')).rejects.toThrow(
        'Failed to delete product',
      );
    });
  });
});
