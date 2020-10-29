import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateInformationComponent } from './private-information.component';

describe('PrivateInformationComponent', () => {
  let component: PrivateInformationComponent;
  let fixture: ComponentFixture<PrivateInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
