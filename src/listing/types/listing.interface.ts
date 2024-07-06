export interface TransformedProduct {
  id: string;
  brandId: string;
  name: string;
  description?: string;
  refNo: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransformedListing {
  id: string;
  product: TransformedProduct;
  currency: string;
  price: number;
  year: string;
  box: boolean;
  papers: boolean;
  location: string;
  condition: string;
  createdAt: Date;
  updatedAt: Date;
  images: TransformedListingImage[];
}

export interface TransformedListingImage {
  id: string;
  listingId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
