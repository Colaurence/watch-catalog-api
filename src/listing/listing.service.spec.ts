import { Test, TestingModule } from '@nestjs/testing';
import { ListingService } from './listing.service';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencyGateway } from '../gateway/currency-conversion/currency.gateway';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { HttpException } from '@nestjs/common';

describe('ListingService', () => {
  let service: ListingService;
  let prismaService: PrismaService;
  let currencyGateway: CurrencyGateway;

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
      providers: [
        ListingService,
        {
          provide: PrismaService,
          useValue: {
            listing: {
              create: jest.fn().mockResolvedValue(mockListing),
              findMany: jest.fn().mockResolvedValue([mockListing]),
              findUniqueOrThrow: jest.fn().mockResolvedValue(mockListing),
              update: jest.fn().mockResolvedValue(updatedListing),
              delete: jest.fn().mockResolvedValue(mockListing),
              count: jest.fn().mockResolvedValue(1),
            },
            listingImg: {
              deleteMany: jest.fn().mockResolvedValue(null),
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

    service = module.get<ListingService>(ListingService);
    prismaService = module.get<PrismaService>(PrismaService);
    currencyGateway = module.get<CurrencyGateway>(CurrencyGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const result = await service.create(createListingDto);
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
        .spyOn(prismaService.listing, 'create')
        .mockRejectedValue(new Error('Creation failed'));

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

      await expect(service.create(createListingDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of listings', async () => {
      const result = await service.findAll({ page: 1, perPage: 10 }, '', '');
      expect(result).toBeInstanceOf(Object);
      expect(result.data[0]).toHaveProperty('price');
      expect(result.data[0]).toHaveProperty('currency');
      expect(result.meta).toEqual(mockPaginatedResult.meta);
    });

    it('should handle errors during findAll', async () => {
      jest
        .spyOn(prismaService.listing, 'findMany')
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
        'HKD',
      );
      expect(result.data[0].currency).toBe('HKD');
      expect(result.data[0].price).toBe(mockListing.price * 1.2);
    });
  });

  describe('findOne', () => {
    it('should return a single listing', async () => {
      const result = await service.findOne('cly8lr71f0000zp50p94q7rtb');
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
        .spyOn(prismaService.listing, 'findUniqueOrThrow')
        .mockRejectedValue(new Error('FindOne failed'));

      await expect(
        service.findOne('cly8lr71f0000zp50p94q7rtb'),
      ).rejects.toThrow(HttpException);
    });

    it('should convert prices to the specified currency', async () => {
      jest.spyOn(currencyGateway, 'getExchangeRate').mockResolvedValueOnce(1.2);
      const result = await service.findOne('cly8lr71f0000zp50p94q7rtb', 'HKD');
      expect(result.currency).toBe('HKD');
      expect(result.price).toBe(mockListing.price * 1.2);
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

      const result = await service.update(
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
        .spyOn(prismaService.listing, 'update')
        .mockRejectedValue(new Error('Update failed'));

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
        service.update('cly8lr71f0000zp50p94q7rtb', updateListingDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a listing successfully', async () => {
      const result = await service.remove('cly8lr71f0000zp50p94q7rtb');
      expect(result).toBeUndefined();
    });

    it('should handle errors during remove', async () => {
      jest
        .spyOn(prismaService.listing, 'delete')
        .mockRejectedValue(new Error('Delete failed'));

      await expect(service.remove('cly8lr71f0000zp50p94q7rtb')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if the listing does not exist', async () => {
      jest
        .spyOn(prismaService.listing, 'delete')
        .mockRejectedValue(new Error('Failed to delete listing'));

      await expect(service.remove('non-existent-listing-id')).rejects.toThrow(
        'Failed to delete listing',
      );
    });
  });
});
