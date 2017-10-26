import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharboardComponent } from './charboard.component';

describe('CharboardComponent', () => {
  let component: CharboardComponent;
  let fixture: ComponentFixture<CharboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
