import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTripMasterComponent } from './add-trip-master.component';

describe('AddTripMasterComponent', () => {
  let component: AddTripMasterComponent;
  let fixture: ComponentFixture<AddTripMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTripMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTripMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
