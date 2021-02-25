import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeymenBeatStatusComponent } from './keymen-beat-status.component';

describe('KeymenBeatStatusComponent', () => {
  let component: KeymenBeatStatusComponent;
  let fixture: ComponentFixture<KeymenBeatStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeymenBeatStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeymenBeatStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
