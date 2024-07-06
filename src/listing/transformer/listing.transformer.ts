import { Listing, Product, ListingImg } from '@prisma/client';
import {
  TransformedListing,
  TransformedProduct,
  TransformedListingImage,
} from '../types/listing.interface';

const productTransform = (product: Product): TransformedProduct => ({
  id: product.id,
  brandId: product.brandId,
  name: product.name,
  description: product.description,
  refNo: product.refNo,
  thumbnailUrl: product.thumbnailUrl,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const listingImageTransform = (image: ListingImg): TransformedListingImage => ({
  id: image.id,
  listingId: image.listingId,
  url: image.url,
  createdAt: image.createdAt,
  updatedAt: image.updatedAt,
});

export const listingTransform = (
  listing: Listing & { product: Product; images: ListingImg[] },
): TransformedListing => ({
  id: listing.id,
  product: productTransform(listing.product),
  currency: listing.currency,
  price: listing.price,
  year: listing.year,
  box: listing.box,
  papers: listing.papers,
  location: listing.location,
  condition: listing.condition,
  createdAt: listing.createdAt,
  updatedAt: listing.updatedAt,
  images: listing.images.map(listingImageTransform),
});
