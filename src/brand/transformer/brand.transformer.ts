import { Brand, Category } from '@prisma/client';
import { TransformedBrand } from '../types/brand.interface';

export const brandTransform = (
  brand: Brand & { category: Category },
): TransformedBrand => ({
  id: brand.id,
  name: brand.name,
  category: {
    id: brand.category.id,
    name: brand.category.name,
  },
  createdAt: brand.createdAt,
  updatedAt: brand.updatedAt,
});
