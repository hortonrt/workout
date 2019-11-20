import { Component, OnInit, Input } from '@angular/core';
import { faCheck, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { WorkoutService } from 'src/app/_services/workout.service';

@Component({
  selector: 'app-band-selector',
  templateUrl: './band-selector.component.html',
  styleUrls: ['./band-selector.component.scss']
})
export class BandSelectorComponent implements OnInit {
  bands = null;
  faCheck: IconDefinition = faCheck;
  @Input() obj: any;
  constructor(private service: WorkoutService) {
    this.bands = Object.assign([], service.bands);
  }

  ngOnInit() {
  }

  select(band) {
    this.obj.Weight = band.v;
  }

}
