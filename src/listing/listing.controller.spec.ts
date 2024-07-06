import { Test, TestingModule } from '@nestjs/testing';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ListingController', () => {
  let controller: ListingController;
  let service: ListingService;

  const mockListing = {
    id: 'cly8lr71f0000zp50p94q7rtb',
    price: 10000,
    currency: 'USD',
    productId: 'cly8lr71f0000zp50p94q7rtc',
    year: '2022',
    box: true,
    papers: true,
    location: 'ONLINE',
    condition: 'UNWORN',
    images: [
      {
        id: 'cly8lr71f0000zp50p94q7rtd',
        url: 'http://example.com/rolex-image.jpg',
        listingId: 'cly8lr71f0000zp50p94q7rtb',
      },
    ],
    product: {
      id: 'cly8lr71f0000zp50p94q7rtc',
      name: 'Rolex Submariner',
      description: 'A luxury dive watch from Rolex.',
      brandId: 'cly8lr71f0000zp50p94q7rte',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updatedListing = {
    ...mockListing,
    price: 12000,
    year: '2023',
    box: false,
    papers: false,
    location: 'IN_BOUTIQUE',
    condition: 'EXCELLENT',
    images: [
      {
        id: 'cly8lr71f0000zp50p94q7rtd',
        url: 'http://example.com/rolex-image-updated.jpg',
        listingId: 'cly8lr71f0000zp50p94q7rtb',
      },
    ],
  };

  const mockPaginatedResult = {
    data: [mockListing],
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
      controllers: [ListingController],
      providers: [
        {
          provide: ListingService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockListing),
            findAll: jest.fn().mockResolvedValue(mockPaginatedResult),
            findOne: jest.fn().mockResolvedValue(mockListing),
            update: jest.fn().mockResolvedValue(updatedListing),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ListingController>(ListingController);
    service = module.get<ListingService>(ListingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a listing successfully', async () => {
      const createListingDto: CreateListingDto = {
        price: 10000,
        currency: 'USD',
        productId: 'cly8lr71f0000zp50p94q7rtc',
        year: '2022',
        box: true,
        papers: true,
        location: 'ONLINE',
        condition: 'UNWORN',
        images: [{ url: 'http://example.com/rolex-image.jpg' }],
      };

      const result = await controller.create(createListingDto);
      expect(result.price).toBe(createListingDto.price);
      expect(result.currency).toBe(createListingDto.currency);
      expect(result.product.id).toBe(createListingDto.productId);
      expect(result.year).toBe(createListingDto.year);
      expect(result.box).toBe(createListingDto.box);
      expect(result.papers).toBe(createListingDto.papers);
      expect(result.location).toBe(createListingDto.location);
      expect(result.condition).toBe(createListingDto.condition);
      expect(result.images[0].url).toBe(createListingDto.images[0].url);
    });

    it('should handle errors during creation', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(
          new HttpException('Creation failed', HttpStatus.BAD_REQUEST),
        );

      const createListingDto: CreateListingDto = {
        price: 10000,
        currency: 'USD',
        productId: 'cly8lr71f0000zp50p94q7rtc',
        year: '2022',
        box: true,
        papers: true,
        location: 'ONLINE',
        condition: 'UNWORN',
        images: [{ url: 'http://example.com/rolex-image.jpg' }],
      };

      await expect(controller.create(createListingDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of listings', async () => {
      const result = await controller.findAll({ page: 1, perPage: 10 });
      expect(result).toBeInstanceOf(Object);
      expect(result.data[0]).toHaveProperty('price');
      expect(result.data[0]).toHaveProperty('currency');
      expect(result.meta).toEqual(mockPaginatedResult.meta);
    });

    it('should handle errors during findAll', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(
          new HttpException('FindAll failed', HttpStatus.BAD_REQUEST),
        );

      await expect(
        controller.findAll({ page: 1, perPage: 10 }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a single listing', async () => {
      const result = await controller.findOne('cly8lr71f0000zp50p94q7rtb', {});
      expect(result).toMatchObject({
        price: mockListing.price,
        currency: mockListing.currency,
        year: mockListing.year,
        box: mockListing.box,
        papers: mockListing.papers,
        location: mockListing.location,
        condition: mockListing.condition,
      });
    });

    it('should handle errors during findOne', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new HttpException('FindOne failed', HttpStatus.BAD_REQUEST),
        );

      await expect(
        controller.findOne('cly8lr71f0000zp50p94q7rtb', {}),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a listing successfully', async () => {
      const updateListingDto: UpdateListingDto = {
        price: 12000,
        year: '2023',
        box: false,
        papers: false,
        location: 'IN_BOUTIQUE',
        condition: 'EXCELLENT',
        images: [{ url: 'http://example.com/rolex-image-updated.jpg' }],
      };

      const result = await controller.update(
        'cly8lr71f0000zp50p94q7rtb',
        updateListingDto,
      );
      expect(result).toMatchObject({
        price: updateListingDto.price,
        year: updateListingDto.year,
        box: updateListingDto.box,
        papers: updateListingDto.papers,
        location: updateListingDto.location,
        condition: updateListingDto.condition,
        images: [{ url: updateListingDto.images[0].url }],
      });
    });

    it('should handle errors during update', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new HttpException('Update failed', HttpStatus.BAD_REQUEST),
        );

      const updateListingDto: UpdateListingDto = {
        price: 12000,
        year: '2023',
        box: false,
        papers: false,
        location: 'IN_BOUTIQUE',
        condition: 'EXCELLENT',
        images: [{ url: 'http://example.com/rolex-image-updated.jpg' }],
      };

      await expect(
        controller.update('cly8lr71f0000zp50p94q7rtb', updateListingDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a listing successfully', async () => {
      const result = await controller.remove('cly8lr71f0000zp50p94q7rtb');
      expect(result).toBeUndefined();
    });

    it('should handle errors during remove', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new HttpException('Delete failed', HttpStatus.BAD_REQUEST),
        );

      await expect(
        controller.remove('cly8lr71f0000zp50p94q7rtb'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if the listing does not exist', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new HttpException('Failed to delete listing', HttpStatus.BAD_REQUEST),
        );

      await expect(
        controller.remove('non-existent-listing-id'),
      ).rejects.toThrow('Failed to delete listing');
    });
  });
});
