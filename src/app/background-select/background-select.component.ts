import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-background-select',
  templateUrl: './background-select.component.html',
  styleUrls: ['./background-select.component.scss'],
})
export class BackgroundSelectComponent implements OnInit {
  @ViewChild('backgroundImageInput', { static: true })
  backgroundImageInput: ElementRef;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<BackgroundSelectComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { url: string }
  ) {}

  ngOnInit(): void {
    this.backgroundImageInput.nativeElement.value = this.data.url;
  }

  applyBackground(url: string): void {
    this.bottomSheetRef.dismiss(url);
  }
}
