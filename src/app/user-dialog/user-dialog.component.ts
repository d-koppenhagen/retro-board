import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';

import { OwnUser } from '../shared/active-users';
import { UserService } from '../shared/user.service';
@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent {
  name: string;

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}

  addUser() {
    if (this.name && this.name.trim() !== '') {
      const user: OwnUser = {
        username: this.name,
        uuid: uuidv4(),
      };
      this.userService.setOwnUser(user);
      this.dialogRef.close(user);
    }
  }
}
