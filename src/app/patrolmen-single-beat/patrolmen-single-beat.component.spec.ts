import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrolmenSingleBeatComponent } from './patrolmen-single-beat.component';

describe('PatrolmenSingleBeatComponent', () => {
  let component: PatrolmenSingleBeatComponent;
  let fixture: ComponentFixture<PatrolmenSingleBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrolmenSingleBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrolmenSingleBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
