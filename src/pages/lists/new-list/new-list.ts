import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { firebaseDb } from '../../../providers/firebase'

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.html',
  styleUrls: ['./new-list.sass']
})
export class NewListPage implements OnInit {
  listForm: FormGroup;

  constructor (private formBuilder: FormBuilder) {
    this.listForm = formBuilder.group({
      name: '',
      description: ''
    })
  }

  ngOnInit() {
    console.log('oi')
  }

  onSubmit () {
    console.log('ah não')
    console.log(this.listForm.value)
  }
}
