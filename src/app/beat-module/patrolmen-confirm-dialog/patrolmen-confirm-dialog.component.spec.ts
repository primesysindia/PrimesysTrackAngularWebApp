import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrolmenConfirmDialogComponent } from './patrolmen-confirm-dialog.component';

describe('PatrolmenConfirmDialogComponent', () => {
  let component: PatrolmenConfirmDialogComponent;
  let fixture: ComponentFixture<PatrolmenConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrolmenConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrolmenConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
