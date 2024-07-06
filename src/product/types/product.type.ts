export interface TransformedBrand {
  id: string;
  name: string;
}

export interface TransformedListing {
  id: string;
  currency: string;
  price: number;
  year: string;
  box: boolean;
  papers: boolean;
  location: string;
  condition: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransformedProduct {
  id: string;
  name: string;
  brand: TransformedBrand;
  description?: string;
  refNo: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
  listings: TransformedListing[];
}
