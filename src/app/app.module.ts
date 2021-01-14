import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { StickyNoteComponent } from './sticky-note/sticky-note.component';
import { BackgroundSelectComponent } from './background-select/background-select.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AppRoutingModule } from './app-routing.module';
import { BoardComponent } from './board/board.component';
import { HttpClientModule } from '@angular/common/http';
import { ClearBoardDialogComponent } from './clear-board-dialog/clear-board-dialog.component';
import { RulerComponent } from './ruler/ruler.component';
import { BoardUrlDialogComponent } from './board-url-dialog/board-url-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    UserDialogComponent,
    StickyNoteComponent,
    BackgroundSelectComponent,
    BoardComponent,
    ClearBoardDialogComponent,
    RulerComponent,
    BoardUrlDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBadgeModule,
    MatBottomSheetModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [UserDialogComponent],
})
export class AppModule {}
