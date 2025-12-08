import HttpMethod from '@/api/http-method';
import { baseQueryWithReauth } from '@/api/savify-api';
import { AddCategoryRequest } from '@/features/finance-tracking/categories/add-category';
import { Category } from '@/features/finance-tracking/categories/category';
import { EditCategoryRequest } from '@/features/finance-tracking/categories/edit-category';
import { createApi } from '@reduxjs/toolkit/query/react';

const categoriesApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: 'categoriesApi',
  endpoints: (builder) => ({
    addCategory: builder.mutation<string, AddCategoryRequest>({
      query: ({ name, icon, type }) => ({
        url: '/finance-tracking/categories',
        method: HttpMethod.POST,
        body: {
          name,
          icon,
          type,
        },
      }),
    }),

    editCategory: builder.mutation<void, EditCategoryRequest>({
      query: ({ id, name, icon }) => ({
        url: `/finance-tracking/categories/${id}`,
        method: HttpMethod.PATCH,
        body: {
          name,
          icon,
        },
      }),
    }),

    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: '/finance-tracking/categories',
      }),
    }),
  }),
});

export default categoriesApi;

export const { useAddCategoryMutation, useEditCategoryMutation, useGetCategoriesQuery } =
  categoriesApi;
