import { Category } from '@prisma/client';

export const categoryTransform = (category: Category) => ({
  id: category.id,
  name: category.name,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});
