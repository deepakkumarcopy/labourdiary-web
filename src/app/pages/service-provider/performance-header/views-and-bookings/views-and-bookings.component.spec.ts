import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsAndBookingsComponent } from './views-and-bookings.component';

describe('ViewsAndBookingsComponent', () => {
  let component: ViewsAndBookingsComponent;
  let fixture: ComponentFixture<ViewsAndBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewsAndBookingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsAndBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
