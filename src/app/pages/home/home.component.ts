import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(
    private cartService: CartService,
    private storeService: StoreService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.getProducts();
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
    console.log(newCategory);
    this.category = newCategory;
    this.getProducts();
  }

  getProducts(): void {
    // this.productsSubscription = this.storeService
    //   .getAllProducts(this.count, this.sort, this.category)
    //   .subscribe((_products) => {
    //     this.products = _products;
    //   });
    console.log(this.category);
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
    this.cartService.addToCart({
      // product: product.image,
      // name: product.title,
      // price: product.price,
      // quantity: 1,
      // id: product.id,
      product: product.image,
      name: product.food_name,
      price: product.price,
      quantity: 1,
      id: product.food_id,
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
}
