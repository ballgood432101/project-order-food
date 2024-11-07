import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { StoreService } from 'src/app/services/store.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  rowHeight: number = ROWS_HEIGHT[this.cols];
  products: Array<Product> | undefined;
  count = '12';
  sort = 'desc';
  category: string | undefined;
  productsSubscription: Subscription | undefined;
  subscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private storeService: StoreService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getCart();
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[colsNum];
  }

  onItemsCountChange(count: number): void {
    this.count = count.toString();
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  getCart(): void {
    this.cartService.getCart().subscribe(() => {});
  }

  getProducts(): void {
    if (this.foodService.getFoodsFromService.length > 0) {
      this.products = this.foodService.getFoodsFromService;
      if (this.category) {
        this.products = this.foodService.getFoodsFromService?.filter(
          (result) => result.food_type === this.category
        );
      }
      return;
    }

    this.foodService.getFoods().subscribe((res) => {
      this.products = res;
      if (this.category) {
        this.products = this.products?.filter(
          (result) => result.food_type === this.category
        );
      }
    });
  }

  onAddToCart(product: Product): void {
    this.subscription.add(
      this.cartService.cart2.pipe(take(1)).subscribe((cart: any) => {
        const existingItem = cart.items.find(
          (item: any) => item.food_id === product.food_id
        );

        const idForUpdate = existingItem ? existingItem.id : undefined;

        this.cartService
          .addToCart({
            image: product.image,
            food_name: product.food_name,
            price: product.price,
            quantity: 1,
            food_id: product.food_id,
            id: idForUpdate,
            status: 'pending',
          })
          .subscribe(() => {});
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
