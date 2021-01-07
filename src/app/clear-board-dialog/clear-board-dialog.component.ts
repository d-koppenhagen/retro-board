import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-clear-board-dialog',
  templateUrl: './clear-board-dialog.component.html',
  styleUrls: ['./clear-board-dialog.component.css'],
})
export class ClearBoardDialogComponent {
  constructor(public dialogRef: MatDialogRef<ClearBoardDialogComponent>) {}

  doClear() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
