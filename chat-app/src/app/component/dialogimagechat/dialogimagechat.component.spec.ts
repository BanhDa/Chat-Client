import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogimagechatComponent } from './dialogimagechat.component';

describe('DialogimagechatComponent', () => {
  let component: DialogimagechatComponent;
  let fixture: ComponentFixture<DialogimagechatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogimagechatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogimagechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
