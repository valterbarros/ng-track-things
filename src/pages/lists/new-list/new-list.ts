import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { firebaseDb } from '../../../providers/firebase'

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.html',
  styleUrls: ['./new-list.sass']
})
export class NewListPage implements OnInit {
  listForm: FormGroup;
  subLists: FormArray;

  constructor (private formBuilder: FormBuilder) {
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

  addSubList () {
    this.subLists = this.listForm.get('subLists') as FormArray;

    this.subLists.push(this.createSubList());
  }

  createSubList(): FormGroup {
    return this.formBuilder.group({
      title: '',
    });
  }

  ngOnInit() {
    console.log('oi')
  }

  onSubmit () {
    const listParams = {
      title: this.listForm.name,
      repeat_days: this.repeatDays,
      description: this.description,
      deadline: this.deadline
    }

    const batch = firebaseDb.batch()
    const listRef = firebaseDb.collection('lists').doc()

    for (let subList of ruleForm.sub_lists) {
      let title = subList.title
      let listId = listRef.id
      let subListRef = firebaseDb.collection('sub_lists').doc()

      batch.set(subListRef, { title, list_id: listId })
    }

    batch.set(listRef, listParams)

    batch.commit().then(() => {
      return this.$router.push({name: 'Lists'})
    }).catch(function (error) {
      console.error('Error during batch commit: ', error)
    })
  }
}
