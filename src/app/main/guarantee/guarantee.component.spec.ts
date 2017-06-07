import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeComponent } from './guarantee.component';

describe('GuaranteeComponent', () => {
  let component: GuaranteeComponent;
  let fixture: ComponentFixture<GuaranteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
