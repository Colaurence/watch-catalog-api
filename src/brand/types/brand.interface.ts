export interface TransformedCategory {
  id: string;
  name: string;
}

export interface TransformedBrand {
  id: string;
  name: string;
  category: TransformedCategory;
  createdAt: Date;
  updatedAt: Date;
}
