import { Component, OnInit } from '@angular/core';
import { FavouriteModel } from 'src/app/models/favourite.model';
import { Product } from 'src/app/models/product.model';
import { FavouriteService } from 'src/app/services/favourite.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-favourties',
  templateUrl: './favourties.component.html',
  styleUrls: ['./favourties.component.scss'],
})
export class FavourtiesComponent implements OnInit {
  cols = 3;
  rowHeight: number = ROWS_HEIGHT[this.cols];
  favouriteProducts: Product[] = [];
  constructor(private favouriteService: FavouriteService) {}

  ngOnInit(): void {
    this.favouriteService.favourites.subscribe((res) => {
      console.log(res);
      this.favouriteProducts = res;
    });
  }
}
