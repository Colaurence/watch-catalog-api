import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

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
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockProduct),
            findAll: jest.fn().mockResolvedValue(mockPaginatedResult),
            findOne: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue(updatedProduct),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Rolex Submariner',
        brandId: 'cly8lr71f0000zp50p94q7rtc',
        description: 'A classic diving watch with a timeless design.',
        thumbnailUrl: 'http://example.com/rolex-submariner.jpg',
      };

      const result = await controller.create(createProductDto);
      expect(result.refNo).toBe('123456-7890');
      expect(result.name).toBe(createProductDto.name);
      expect(result.brand.id).toBe(createProductDto.brandId);
      expect(result.description).toBe(createProductDto.description);
      expect(result.thumbnailUrl).toBe(createProductDto.thumbnailUrl);
    });

    it('should handle errors during creation', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(
          new HttpException(
            'Creation failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      const createProductDto: CreateProductDto = {
        name: 'Rolex Submariner',
        brandId: 'cly8lr71f0000zp50p94q7rtc',
        description: 'A classic diving watch with a timeless design.',
        thumbnailUrl: 'http://example.com/rolex-submariner.jpg',
      };

      await expect(controller.create(createProductDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const result = await controller.findAll({ page: 1, perPage: 10 });
      expect(result).toBeInstanceOf(Object);
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('description');
      expect(result.data[0]).toHaveProperty('thumbnailUrl');
      expect(result.meta).toEqual(mockPaginatedResult.meta);
    });

    it('should handle errors during findAll', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(
          new HttpException('FindAll failed', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      await expect(
        controller.findAll({ page: 1, perPage: 10 }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = await controller.findOne('cly8lr71f0000zp50p94q7rtb', {});
      expect(result).toBeInstanceOf(Object);
      expect(result.name).toBe(mockProduct.name);
      expect(result.description).toBe(mockProduct.description);
      expect(result.thumbnailUrl).toBe(mockProduct.thumbnailUrl);
    });

    it('should handle errors during findOne', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new HttpException('FindOne failed', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      await expect(
        controller.findOne('cly8lr71f0000zp50p94q7rtb', {}),
      ).rejects.toThrow(HttpException);
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

      const result = await controller.update(
        'cly8lr71f0000zp50p94q7rtb',
        updateProductDto,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result.name).toBe(updateProductDto.name);
      expect(result.description).toBe(updateProductDto.description);
      expect(result.thumbnailUrl).toBe(updateProductDto.thumbnailUrl);
    });

    it('should handle errors during update', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new HttpException('Update failed', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      const updateProductDto: UpdateProductDto = {
        name: 'Rolex Submariner Date',
        description:
          'An updated version of the classic diving watch with a date function.',
        thumbnailUrl: 'http://example.com/rolex-submariner-date.jpg',
      };

      await expect(
        controller.update('cly8lr71f0000zp50p94q7rtb', updateProductDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      const result = await controller.remove('cly8lr71f0000zp50p94q7rtb');
      expect(result).toBeUndefined();
    });

    it('should handle errors during remove', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new HttpException('Delete failed', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      await expect(
        controller.remove('cly8lr71f0000zp50p94q7rtb'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if the product does not exist', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new HttpException('Failed to delete product', HttpStatus.NOT_FOUND),
        );
      await expect(controller.remove('non-existent-prod-id')).rejects.toThrow(
        'Failed to delete product',
      );
    });
  });
});
