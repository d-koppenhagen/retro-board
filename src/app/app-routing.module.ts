import { v4 as uuidv4 } from 'uuid';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';

const routes: Routes = [
  {
    path: ':boardId',
    component: BoardComponent,
  },
  { path: '**', redirectTo: uuidv4() },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
