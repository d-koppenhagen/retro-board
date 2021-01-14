import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardUrlDialogComponent } from './board-url-dialog.component';

describe('BoardUrlDialogComponent', () => {
  let component: BoardUrlDialogComponent;
  let fixture: ComponentFixture<BoardUrlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardUrlDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardUrlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
