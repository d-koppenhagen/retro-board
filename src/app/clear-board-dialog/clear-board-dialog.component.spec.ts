import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearBoardDialogComponent } from './clear-board-dialog.component';

describe('ClearBoardDialogComponent', () => {
  let component: ClearBoardDialogComponent;
  let fixture: ComponentFixture<ClearBoardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearBoardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearBoardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
