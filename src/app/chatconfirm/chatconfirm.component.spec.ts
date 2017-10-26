import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatconfirmComponent } from './chatconfirm.component';

describe('ChatconfirmComponent', () => {
  let component: ChatconfirmComponent;
  let fixture: ComponentFixture<ChatconfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatconfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
