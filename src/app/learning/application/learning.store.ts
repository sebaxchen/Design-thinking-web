import {computed, Injectable, Signal, signal} from '@angular/core';
import {Category} from '../domain/model/category.entity';
import {LearningApi} from '../infrastructure/learning-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

/**
 * State management store for categories using Angular signals.
 */
@Injectable({
  providedIn: 'root'
})
export class LearningStore {
  private readonly categoriesSignal = signal<Category[]>([]);
  readonly categories = this.categoriesSignal.asReadonly();
  readonly categoryCount = computed(() => this.categories().length);

  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private learningApi: LearningApi) {
    this.loadCategories();
  }

  /**
   * Formats error message for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }

  /**
   * Loads all categories from the API
   */
  private loadCategories(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.learningApi.getCategories().pipe(takeUntilDestroyed()).subscribe({
      next: categories => {
        console.log(categories);
        this.categoriesSignal.set(categories);
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('Error loading categories:', err);
        this.loadingSignal.set(false);
        this.errorSignal.set(this.formatError(err, 'Failed to load categories'));
      }
    });
  }

  /**
   * Retrieves a category by its ID as a signal
   * @param id - The ID of the category
   * @returns A Signal containing the Category object or undefined if not found
   */
  getCategoryById(id: number): Signal<Category | undefined> {
    return computed(() => 
      this.categories().find(c => c.id === id) ?? undefined);
  }

  /**
   * Adds a new category
   * @param category - The category to add.
   */
  addCategory(category: Category): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.learningApi.createCategory(category).pipe(retry(2)).subscribe({
      next: createdCategory => {
        this.categoriesSignal.update(categories => [ ...categories, createdCategory]);
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('Error creating category:', err);
        this.loadingSignal.set(false);
        this.errorSignal.set(this.formatError(err, 'Failed to create category'));
      }
    });
  }

  /**
   * Updates an existing category
   * @param updateCategory - The category to update
   */
  updateCategory(updateCategory: Category): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.learningApi.updateCategory(updateCategory).pipe(retry(2)).subscribe({
      next: category => {
        this.categoriesSignal.update(categories =>
          categories.map(c => c.id === category.id ? category : c));
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('Error updating category:', err);
        this.loadingSignal.set(false);
        this.errorSignal.set(this.formatError(err, 'Failed to update category'));
      }
    });
  }

  /**
   * Deletes a category by ID
   * @param id - The ID of the category to delete
   */
  deleteCategory(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.learningApi.deleteCategory(id).pipe(retry(2)).subscribe({
      next: () => {
        this.categoriesSignal.update(categories => categories.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('Error deleting category:', err);
        this.loadingSignal.set(false);
        this.errorSignal.set(this.formatError(err, 'Failed to delete category'));
      }
    });
  }
}