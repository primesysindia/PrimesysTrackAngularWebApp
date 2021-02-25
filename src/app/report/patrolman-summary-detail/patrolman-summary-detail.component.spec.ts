import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrolmanSummaryDetailComponent } from './patrolman-summary-detail.component';

describe('PatrolmanSummaryDetailComponent', () => {
  let component: PatrolmanSummaryDetailComponent;
  let fixture: ComponentFixture<PatrolmanSummaryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrolmanSummaryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrolmanSummaryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
