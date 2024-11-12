import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditPromotionComponent } from './add-or-edit-promotion.component';

describe('AddOrEditPromotionComponent', () => {
  let component: AddOrEditPromotionComponent;
  let fixture: ComponentFixture<AddOrEditPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrEditPromotionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrEditPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
