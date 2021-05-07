import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityModuleComponent } from './utility-module.component';

describe('UtilityModuleComponent', () => {
  let component: UtilityModuleComponent;
  let fixture: ComponentFixture<UtilityModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilityModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilityModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
