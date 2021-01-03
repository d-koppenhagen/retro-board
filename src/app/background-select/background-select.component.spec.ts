import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSelectComponent } from './background-select.component';

describe('BackgroundSelectComponent', () => {
  let component: BackgroundSelectComponent;
  let fixture: ComponentFixture<BackgroundSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
