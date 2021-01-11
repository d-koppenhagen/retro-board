import { v4 as uuidv4 } from 'uuid';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { CanvasComponent } from '../canvas/canvas.component';
import { StickyNote, StickyNoteDbo } from '../shared/sticky-note';
import { DataService } from '../shared/data.service';
import { BackgroundSelectComponent } from '../background-select/background-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnUser } from '../shared/active-users';
import { ClearBoardDialogComponent } from '../clear-board-dialog/clear-board-dialog.component';
import { Ruler } from '../shared/ruler';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('appCanvas', { static: true }) appCanvas: CanvasComponent;
  boardId: string;
  title = 'Canvas';
  shape = '';
  strokeWidth = 4;
  strokeColor = '#ffc107';
  fillColor = 'transparent';
  currentFillColorIdx = 0;
  currentStrokeColorIdx = 2;
  name = '';
  users = {};
  stickyNotes: StickyNote[] = [];
  rulers: Ruler[] = [];
  availableColors = [
    'transparent',
    '#ff5733',
    '#ff9800',
    '#ffeb3b',
    '#8bc34a',
    '#33E1AF',
    '#03a9f4',
    '#336AE1',
    '#B479F7',
    '#E990F9',
    '#E1335D',
  ];
  random = Math.floor(Math.random() * this.availableColors.length) + 1;
  objectKeys = Object.keys;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg')
    );
  }

  /**
   * add a new empty note
   */
  addNote(): void {
    this.shape = 'sticky_note';
    this.stickyNotes.push({
      title: '',
      description: '',
      uuid: uuidv4(),
      left: 50,
      top: 50,
      backgroundColor: this.fillColor,
      editMode: true,
    });
  }

  /**
   * remove a sticky note by it's uuid
   */
  removeNote(noteUuid: string) {
    this.stickyNotes = this.stickyNotes.filter(
      (note) => note.uuid !== noteUuid
    );
  }

  /**
   * Update an existing sticky note
   */
  updateNote(stickyNote: StickyNote) {
    const matchIndex = this.stickyNotes.findIndex(
      (note) => note.uuid === stickyNote.uuid
    );
    this.stickyNotes[matchIndex] = stickyNote;
    this.dataService.updateStickyNote(this.boardId, stickyNote);
    // this.dataService.updateNotes(this.stickyNotes);
  }

  /**
   * open user dialog
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((user: OwnUser) => {
      this.name = user.username;
      this.dataService.ownUserOnline(this.boardId, user);
    });
  }

  // Method to logout
  logout() {
    this.name = '';
    this.dataService.logout(this.boardId, this.dataService.getOwnUser());
    this.openDialog();
  }

  clearAll() {
    const dialogRef = this.dialog.open(ClearBoardDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((doClear: boolean) => {
      if (doClear) {
        this.dataService.clearAll(this.boardId).then(() => {
          location.reload();
        });
      }
    });
  }

  // Init Method for the component
  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('boardId');
    this.initBoard();
  }

  initBoard(): void {
    const user = this.dataService.getOwnUser();
    if (!user) {
      this.openDialog();
    } else {
      this.name = user.username;
      this.dataService.ownUserOnline(this.boardId, user);
    }

    this.dataService.getUsers(this.boardId).subscribe((activeUsers) => {
      this.users = activeUsers || {};
      this.stickyNotes.forEach((note) => {
        this.dataService.updateStickyNote(this.boardId, note);
      });
    });

    this.dataService
      .stickyNotesUpdates(this.boardId)
      .subscribe((stickyNotes: StickyNoteDbo) => {
        if (!stickyNotes) {
          return (this.stickyNotes = []);
        } else {
          for (const [key, value] of Object.entries(stickyNotes)) {
            const matchIndex = this.stickyNotes.findIndex(
              (note) => note.uuid === key
            );
            const noteConverted = { ...value, uuid: key };
            if (matchIndex === -1) {
              this.stickyNotes.push(noteConverted);
            } else {
              this.stickyNotes[matchIndex] = noteConverted;
            }
            // this.dataService.updateNotes(this.stickyNotes);
          }
        }
      });

    this.dataService
      .getBackgroundImage(this.boardId)
      .subscribe((imgSrc: string | null) => {
        this.appCanvas.backgroundImage = imgSrc || '';
      });

    this.dataService
      .getRulers(this.boardId)
      .subscribe((rulers: Ruler[] | null) => {
        this.rulers = rulers && rulers.length ? rulers : [];
      });
  }

  nextFillColor() {
    this.currentFillColorIdx =
      this.currentFillColorIdx === this.availableColors.length - 1
        ? 0
        : this.currentFillColorIdx + 1;
    this.fillColor = this.availableColors[this.currentFillColorIdx];
  }

  nextStrokeColor() {
    this.currentStrokeColorIdx =
      this.currentStrokeColorIdx === this.availableColors.length - 1
        ? 0
        : this.currentStrokeColorIdx + 1;
    this.strokeColor = this.availableColors[this.currentStrokeColorIdx];
  }

  openBottomSheet() {
    const bottomSheetRef = this.bottomSheet.open(BackgroundSelectComponent, {
      data: { url: this.appCanvas.backgroundImage },
    });
    bottomSheetRef.afterDismissed().subscribe((url: string) => {
      this.appCanvas.backgroundImage = url;
      this.dataService.setBackgroundImage(this.boardId, url);
    });
  }

  addRuler(direction: 'horizontal' | 'vertical') {
    this.rulers.push({
      direction,
      positionOnAxis: 50,
      id: uuidv4(),
    });
  }

  updateRulers(rulers: Ruler[]) {
    this.dataService.setRulers(this.boardId, rulers);
  }

  exportAsImage() {
    html2canvas(document.getElementById('mat-card-content')).then((canvas) => {
      console.log(canvas);
      const href = canvas
        .toDataURL()
        .replace('image/png', 'image/octet-stream');
      const a = document.createElement('a');
      a.href = href;
      a.download = `board-${this.boardId}.png`;
      a.click();
    });
  }

  exportAsJSON() {
    this.dataService.getBoardData(this.boardId).subscribe((res) => {
      const href =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(res, null, 2));
      const a = document.createElement('a');
      a.href = href;
      a.download = `board-${this.boardId}.json`;
      a.click();
    });
  }
}
