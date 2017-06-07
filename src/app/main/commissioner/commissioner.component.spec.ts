import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionerComponent } from './commissioner.component';

describe('CommissionerComponent', () => {
  let component: CommissionerComponent;
  let fixture: ComponentFixture<CommissionerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
