import { Component, OnInit, OnDestroy } from '@angular/core';

import { faDumbbell, faSync } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {
  faDumbbell = faDumbbell;
  faSync = faSync;
  to = null;
  reload = false;
  constructor() { }

  ngOnInit() {
    this.to = setTimeout(x => {
      this.reload = true;
    }, 10000);
  }

  reloadFunc() {
    location.reload();
  }

  ngOnDestroy() {
    clearTimeout(this.to);
  }
}
