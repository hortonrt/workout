import { Component, OnInit, Input, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt, faClone, faTrashAlt as faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-buttons',
  templateUrl: './edit-buttons.component.html',
  styleUrls: ['./edit-buttons.component.scss']
})
export class EditButtonsComponent implements OnInit {
  @Input() color = 'text-body';
  @Input() btn = 'btn-white';
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() clone: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Input() obj;
  @Input() addObj = null;
  @Input() type;
  faPencil: IconDefinition = faPencilAlt;
  faClone: IconDefinition = faClone;
  faTrash: IconDefinition = faTrash;
  faPlus: IconDefinition = faPlus;
  cls = 'btn';
  constructor() { }

  ngOnInit() {
    this.cls = 'btn ' + this.btn + ' ' + this.color;
  }

  runDelete() {
    this.delete.emit({ obj: this.obj, type: this.type });
  }

  runClone() {
    this.clone.emit({ obj: this.obj, type: this.type });
  }

  runAdd() {
    this.add.emit({ obj: null, addObj: this.addObj });
  }

  runEdit() {
    this.edit.emit(this.obj);
  }

}
