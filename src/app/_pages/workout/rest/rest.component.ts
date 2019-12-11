import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  faHeartbeat,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.scss']
})
export class RestComponent implements OnInit {
  @Input() blocksummary = null;
  @Input() postrest = 0;
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  restInterval = null;
  ogpostrest = null;
  faTimes = faTimes;
  faHeartbeat = faHeartbeat;
  faCheck = faCheck;
  constructor() { }

  ngOnInit() {
    this.ogpostrest = this.postrest;
    const restStart = new Date();
    const restEnd = new Date();
    restEnd.setSeconds(restEnd.getSeconds() + this.postrest);
    this.restInterval = setInterval(() => {
      this.postrest = this.ogpostrest - Math.floor(Math.abs(new Date().getTime() - restStart.getTime()) / 1000);
      if (new Date() > restEnd) {
        clearInterval(this.restInterval);
        this.next.emit(true);
      }
    }, 1000);
  }
}
