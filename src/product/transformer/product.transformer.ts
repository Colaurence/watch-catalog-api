import { Product, Brand, Listing } from '@prisma/client';
import { TransformedProduct, TransformedListing } from '../types/product.type';

const listingTransform = (listing: Listing): TransformedListing => ({
  id: listing.id,
  currency: listing.currency,
  price: listing.price,
  year: listing.year,
  box: listing.box,
  papers: listing.papers,
  location: listing.location,
  condition: listing.condition,
  createdAt: listing.createdAt,
  updatedAt: listing.updatedAt,
});

export const productTransform = (
  product: Product & { brand: Brand; listings: Listing[] },
): TransformedProduct => ({
  id: product.id,
  name: product.name,
  brand: {
    id: product.brand.id,
    name: product.brand.name,
  },
  description: product.description,
  refNo: product.refNo,
  thumbnailUrl: product.thumbnailUrl,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  listings: product.listings.map(listingTransform),
});
