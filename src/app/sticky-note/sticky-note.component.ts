import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StickyNote } from '../shared/sticky-note';

@Component({
  selector: 'app-sticky-note',
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.scss'],
})
export class StickyNoteComponent implements OnInit {
  @Input() note: StickyNote;
  @Output() update = new EventEmitter();
  @Output() remove = new EventEmitter();

  formGroup: FormGroup;
  hasBeenClickedOnce = false;
  noteColor: string;
  noteCreated = false;
  hideNote = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.noteColor = this.note.backgroundColor;
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      title: [this.note.title, [Validators.required]],
      description: [this.note.description, []],
    });
  }

  onSubmit(formData) {
    this.note.title = formData.title;
    this.note.description = formData.description;
    this.note.editMode = false;
    this.hasBeenClickedOnce = false;
    this.noteCreated = true;
    this.update.emit(this.note);
  }

  cancelEdit() {
    if (this.noteCreated) {
      this.formGroup.reset();
      this.note.editMode = false;
    } else {
      this.remove.emit(this.note.uuid);
    }
  }

  editOnDoubleClick() {
    if (this.hasBeenClickedOnce) {
      this.note.editMode = true;
    }
    this.hasBeenClickedOnce = true;
    setTimeout(() => {
      this.hasBeenClickedOnce = false;
    }, 250);
  }

  dragEnded($event: CdkDragEnd) {
    const { offsetLeft, offsetTop } = $event.source.element.nativeElement;
    const { x, y } = $event.distance;
    this.note.left = offsetLeft + x;
    this.note.top = offsetTop + y;
    // reset drag transform as the position has been refreshed
    $event.source.reset();
    this.update.emit(this.note);
  }
}
