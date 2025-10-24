import {Routes} from '@angular/router';

const categoryList = () =>
  import('./category-list/category-list').then(m => m.CategoryList);

export const learningRoutes: Routes = [
  { path: 'categories', loadComponent: categoryList},
];
