import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { faStopwatch, } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() we = null;
  @Input() audioCtx = null;
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  timerrunning = false;
  faStopwatch = faStopwatch;
  timerInt = null;
  countInt = null;
  countingin = false;
  countin = 0;
  timerval = null;
  constructor() { }

  ngOnInit() {
    this.timerval = this.we.Timer;
    if (this.we.AutoRun) {
      this.toggleTimer();
    }
  }

  ngOnDestroy() {
    if (this.timerInt) { clearInterval(this.timerInt); }
    if (this.countInt) { clearInterval(this.countInt); }
  }

  toggleTimer() {
    this.toggle.emit(true);
    this.timerrunning = !this.timerrunning;
    if (this.timerrunning) {
      if (this.we.AutoRun === 0) {
        this.countIn();
      } else {
        this.startTimer();
      }
    } else {
      clearInterval(this.timerInt);
    }
  }

  startTimer() {
    this.timerInt = setInterval(() => {
      if (this.timerval === 1) {
        this.buzzer(true);
      } else if (this.timerval <= 6 && this.timerval > 1) {
        this.buzzer(false);
      }
      if (this.timerval > 0) {
        this.timerval -= 1;
      }
    }, 1000);
  }

  buzzer(full) {
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    gainNode.gain.value = 1;
    oscillator.frequency.value = 100;
    oscillator.type = 'sawtooth';
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      if (full) {
        this.timerrunning = false;
        if (this.we.AutoRun === 1) {
          clearInterval(this.timerInt);
          this.next.emit(false);
        } else {
          this.toggle.emit(false);
        }
      }
    }, full ? 1000 : 250);
  }

  countIn() {
    let times = 3;
    this.countin = times + 1;
    this.countingin = true;
    this.countInt = setInterval(() => {
      this.countInSound(times);
      times -= 1;
      this.countin = times + 1;
      if (times < 0) {
        clearInterval(this.countInt);
        this.countingin = false;
        this.startTimer();
      }
    }, 1000);
  }

  countInSound(last) {
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    gainNode.gain.value = 1;
    oscillator.frequency.value = last === 0 ? 450 : 300;
    oscillator.type = 'triangle';
    oscillator.start();
    setTimeout(() => { oscillator.stop(); }, 500);
  }

}
