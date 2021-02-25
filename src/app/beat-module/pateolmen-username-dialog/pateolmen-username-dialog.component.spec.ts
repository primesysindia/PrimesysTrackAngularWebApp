import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PateolmenUsernameDialogComponent } from './pateolmen-username-dialog.component';

describe('PateolmenUsernameDialogComponent', () => {
  let component: PateolmenUsernameDialogComponent;
  let fixture: ComponentFixture<PateolmenUsernameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PateolmenUsernameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PateolmenUsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
