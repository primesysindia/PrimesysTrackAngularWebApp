import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllKeymenExistingBeatsComponent } from './all-keymen-existing-beats.component';

describe('AllKeymenExistingBeatsComponent', () => {
  let component: AllKeymenExistingBeatsComponent;
  let fixture: ComponentFixture<AllKeymenExistingBeatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllKeymenExistingBeatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllKeymenExistingBeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
