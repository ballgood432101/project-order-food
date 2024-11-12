import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { FavouriteService } from 'src/app/services/favourite.service';
import { FoodService } from 'src/app/services/food.service';

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
  private favourites: Product[] = [];

  constructor(
    private cartService: CartService,
    private foodService: FoodService,
    private authService: AuthService,
    private favouriteService: FavouriteService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    if (this.authService.isLoggedIn) {
      this.getCart();
    }
    this.favouriteService.favourites.subscribe((res) => {
      this.favourites = res;
      this.mapFavouriteId();
    });
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
      this.applyCategoryFilterAndMap();
      return;
    }

    this.foodService.getFoods().subscribe((res) => {
      this.products = res;
      this.applyCategoryFilterAndMap();
    });
  }

  private applyCategoryFilterAndMap(): void {
    if (this.category === 'All') {
      this.mapFavouriteId();
      return;
    }

    if (this.category && this.products) {
      this.products = this.products.filter(
        (result) => result.food_type === this.category
      );
    }

    // Map favorite IDs
    this.mapFavouriteId();
  }

  private mapFavouriteId(): void {
    if (this.products && this.authService.isLoggedIn) {
      this.products = this.products.map((product) => {
        const favourite = this.favourites.find(
          (fav) => fav.food_id === product.food_id
        );
        return {
          ...product,
          favourite_id: favourite ? favourite.favourite_id : undefined,
        };
      });
    }
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
