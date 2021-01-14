import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-board-url-dialog',
  templateUrl: './board-url-dialog.component.html',
  styleUrls: ['./board-url-dialog.component.css'],
})
export class BoardUrlDialogComponent {
  slug: string;
  checked: boolean;

  constructor(
    public dialogRef: MatDialogRef<BoardUrlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    this.slug = data;
  }

  changeSlug() {
    this.dialogRef.close(this.slug.trim());
  }
}
