import {baseApi} from '.';
import {CATEGORY_TAGS} from './_tags';
import {Category} from '../../types/category';

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getCategories: build.query<Category[], void>({
      query: () => 'categories',
      providesTags: [CATEGORY_TAGS.CATEGORIES],
    }),
    getCategoryById: build.query<Category, string>({
      query: id => `categories/${id}`,
      providesTags: (_, __, id) => [{type: CATEGORY_TAGS.CATEGORIES, id}],
    }),
  }),
});

export const {useGetCategoriesQuery, useGetCategoryByIdQuery} = categoriesApi;
