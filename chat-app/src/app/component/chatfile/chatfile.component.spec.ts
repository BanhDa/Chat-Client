import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatfileComponent } from './chatfile.component';

describe('ChatfileComponent', () => {
  let component: ChatfileComponent;
  let fixture: ComponentFixture<ChatfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
