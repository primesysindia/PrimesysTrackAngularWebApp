import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrolmenBeatUpdateComponent } from './patrolmen-beat-update.component';

describe('PatrolmenBeatUpdateComponent', () => {
  let component: PatrolmenBeatUpdateComponent;
  let fixture: ComponentFixture<PatrolmenBeatUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrolmenBeatUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrolmenBeatUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
