import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PateolmenBeatStatusComponent } from './pateolmen-beat-status.component';

describe('PateolmenBeatStatusComponent', () => {
  let component: PateolmenBeatStatusComponent;
  let fixture: ComponentFixture<PateolmenBeatStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PateolmenBeatStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PateolmenBeatStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
