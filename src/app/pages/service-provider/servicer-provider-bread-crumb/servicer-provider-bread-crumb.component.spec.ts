import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicerProviderBreadCrumbComponent } from './servicer-provider-bread-crumb.component';

describe('ServicerProviderBreadCrumbComponent', () => {
  let component: ServicerProviderBreadCrumbComponent;
  let fixture: ComponentFixture<ServicerProviderBreadCrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicerProviderBreadCrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicerProviderBreadCrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
