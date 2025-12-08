import { CategoryType } from '@/features/finance-tracking/categories/category';

export interface AddCategoryRequest {
  name: string;
  type: CategoryType;
  icon: string;
}
