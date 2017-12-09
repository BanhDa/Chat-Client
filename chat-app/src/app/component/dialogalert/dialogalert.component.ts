import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dialogalert',
  templateUrl: './dialogalert.component.html',
  styleUrls: ['./dialogalert.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class DialogalertComponent implements OnInit, OnChanges {

  @Input() closable = true;
  @Input() visible: boolean;
  @Input() messageAlert = 'Error!';
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
    this.messageAlert = this.messageAlert === undefined || this.messageAlert === '' ? 'Error!' : this.messageAlert;
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}
