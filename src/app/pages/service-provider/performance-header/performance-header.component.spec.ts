import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceHeaderComponent } from './performance-header.component';

describe('PerformanceHeaderComponent', () => {
  let component: PerformanceHeaderComponent;
  let fixture: ComponentFixture<PerformanceHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
