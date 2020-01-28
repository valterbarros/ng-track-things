import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { firebaseDb } from '../../../providers/firebase';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.html',
  styleUrls: ['./new-list.scss']
})
export class NewListPage implements OnInit {
  listForm: FormGroup;
  subLists: FormArray;

  constructor(private formBuilder: FormBuilder) {
    this.listForm = formBuilder.group({
      title: '',
      description: '',
      subLists: this.formBuilder.array([this.createSubList()])
    });
  }

  removeSubList(index) {
    const subLists = this.listForm.get('subLists') as FormArray;

    subLists.removeAt(index);
  }

  addSubList() {
    this.subLists = this.listForm.get('subLists') as FormArray;

    this.subLists.push(this.createSubList());
  }

  createSubList(): FormGroup {
    return this.formBuilder.group({
      title: '',
    });
  }

  ngOnInit() {
    console.log('oi');
  }

  onSubmit() {
    const listParams = {
      title: this.listForm.value.title,
      description: this.listForm.value.description
    };

    const batch = firebaseDb.batch();
    const listRef = firebaseDb.collection('lists').doc();

    for (const subList of this.listForm.value.subLists) {
      const title = subList.title;
      const listId = listRef.id;
      const subListRef = firebaseDb.collection('sub_lists').doc();

      batch.set(subListRef, { title, list_id: listId });
    }

    batch.set(listRef, listParams);

    batch.commit().then(() => {
      console.log('success');
    }).catch(function(error) {
      console.error('Error during batch commit: ', error);
    });
  }
}
