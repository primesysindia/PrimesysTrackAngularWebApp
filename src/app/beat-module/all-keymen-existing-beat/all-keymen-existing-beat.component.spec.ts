import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllKeymenExistingBeatComponent } from './all-keymen-existing-beat.component';

describe('AllKeymenExistingBeatComponent', () => {
  let component: AllKeymenExistingBeatComponent;
  let fixture: ComponentFixture<AllKeymenExistingBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllKeymenExistingBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllKeymenExistingBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
