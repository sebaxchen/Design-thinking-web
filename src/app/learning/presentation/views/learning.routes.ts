import {Routes} from '@angular/router';

const categoryList = () =>
  import('./category-list/category-list').then(m => m.CategoryList);

const categoryForm = () =>
  import('./category-form/category-form').then(m => m.CategoryForm);

export const learningRoutes: Routes = [
  { path: 'categories', loadComponent: categoryList},
  { path: 'categories/new', loadComponent: categoryForm},
  { path: 'categories/:id/edit', loadComponent: categoryForm},
];
