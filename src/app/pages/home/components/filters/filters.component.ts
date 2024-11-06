import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();
  categories: string[] | undefined;
  categoriesSubscription: Subscription | undefined;
  selectedCategory: string = '';

  constructor(private foodService: FoodService) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.foodService
      .getFoods()
      .subscribe((res) => {
        const mapDataToCatagory = res
          .map((result: any) => result.food_type)
          .filter((value: any, index: number, self: any) => {
            return self.indexOf(value) === index;
          });
        this.categories = mapDataToCatagory;
      });
  }

  onCategoryChange(event: any): void {
    this.showCategory.next(event);
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
