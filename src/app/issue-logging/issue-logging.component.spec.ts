import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueLoggingComponent } from './issue-logging.component';

describe('IssueLoggingComponent', () => {
  let component: IssueLoggingComponent;
  let fixture: ComponentFixture<IssueLoggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueLoggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueLoggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
