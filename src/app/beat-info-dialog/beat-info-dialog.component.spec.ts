import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatInfoDialogComponent } from './beat-info-dialog.component';

describe('BeatInfoDialogComponent', () => {
  let component: BeatInfoDialogComponent;
  let fixture: ComponentFixture<BeatInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeatInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
