import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeymenBeatUpdateComponent } from './keymen-beat-update.component';

describe('KeymenBeatUpdateComponent', () => {
  let component: KeymenBeatUpdateComponent;
  let fixture: ComponentFixture<KeymenBeatUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeymenBeatUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeymenBeatUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
