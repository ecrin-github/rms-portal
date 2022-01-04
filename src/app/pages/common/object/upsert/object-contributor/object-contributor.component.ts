import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectContributorInterface } from 'src/app/_rms/interfaces/data-object/object-contributor.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';

@Component({
  selector: 'app-object-contributor',
  templateUrl: './object-contributor.component.html',
  styleUrls: ['./object-contributor.component.scss']
})
export class ObjectContributorComponent implements OnInit {
  form: FormGroup;
  contributorType: [] = [];
  subscription: Subscription = new Subscription();
  @Input() sdOid: string;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  objectContributor: ObjectContributorInterface;
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitContributor: EventEmitter<any> = new EventEmitter();

  constructor( private fb: FormBuilder, private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService) { 
    this.form = this.fb.group({
      objectContributors: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getContributorType();
    if (this.isEdit || this.isView) {
      this.getObjectContributor();
    }
  }
  objectContributors(): FormArray {
    return this.form.get('objectContributors') as FormArray;
  }

  newObjectContributor(): FormGroup {
    return this.fb.group({
      id: '',
      sdOid: '',
      contribTypeId: '',
      isIndividual: false,
      organisationName: '',
      personGivenName: '',
      personFamilyName: '',
      orcidId: '',
      personAffiliation: '',
      alreadyExist: false
    });
  }

  addObjectContributor() {
    this.objectContributors().push(this.newObjectContributor());
  }

  removeObjectContributor(i: number) {
    this.objectContributors().removeAt(i);
  }
  getContributorType() {
    const getContributorType$ = this.objectService.getContributorType().subscribe((res:any) => {
      if(res.data) {
        this.contributorType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getContributorType$);
  }
  getObjectContributor() {
    this.spinner.show();
    this.objectService.getObjectContributor(this.sdOid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.objectContributor = res.data.length ? res.data : [];
        this.patchForm(this.objectContributor);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(contributors) {
    this.form.setControl('objectContributors', this.patchArray(contributors));
  }
  patchArray(contributors): FormArray {
    const formArray = new FormArray([]);
    contributors.forEach(contributor => {
      formArray.push(this.fb.group({
        id: contributor.id,
        sdOid: contributor.sdOid,
        contribTypeId: contributor.contribTypeId,
        isIndividual: contributor.isIndividual,
        organisationName: contributor.organisationName,
        personGivenName: contributor.personGivenName,
        personFamilyName: contributor.personFamilyName,
        orcidId: contributor.orcidId,
        personAffiliation: contributor.personAffiliation,
        alreadyExist: true
      }))
    });
    return formArray;
  }
  addContributor(index) {
    this.spinner.show();
    const payload = this.form.value.objectContributors[index];
    payload.sdOid = this.sdOid;
    payload.isIndividual = payload.isIndividual === 'true' ? true : false;
    delete payload.id;

    this.objectService.addObjectContributor(this.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Contributor added successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editContributor(contributorObject) {
    const payload = contributorObject.value;
    payload.isIndividual = payload.isIndividual === 'true' ? true : false;
    this.spinner.show();
    this.objectService.editObjectContributor(payload.id, payload.sdOid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Object Contributor updated successfully');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  findContributorType(id) {
    const contributorArray: any = this.contributorType.filter((type: any) => type.id === id);
    return contributorArray && contributorArray.length ? contributorArray[0].name : '';
  }
  emitData() {
    const payload = this.form.value.objectContributors.map(item => {
      item.isIndividual = item.isIndividual === 'true' ? true : false;
      if (!item.id) {
        delete item.id;
      }
      if(this.sdOid) {
        item.sdOid = this.sdOid;
      }
      return item;
    })
    this.emitContributor.emit({data: payload, isEmit: false});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
