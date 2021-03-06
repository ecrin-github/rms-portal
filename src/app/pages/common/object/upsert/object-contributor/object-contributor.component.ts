import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ObjectContributorInterface } from 'src/app/_rms/interfaces/data-object/object-contributor.interface';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

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
  isIndividual = [];
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitContributor: EventEmitter<any> = new EventEmitter();

  constructor( private fb: FormBuilder, private objectService: DataObjectService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) { 
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
    const len = this.objectContributors().value.length;
    if (len) {
      if (this.objectContributors().value[len-1].contribTypeId) {
        this.objectContributors().push(this.newObjectContributor());
      } else {
        this.toastr.info('Please provide the Contributor type in the previously added Object Contributor');
      }
    } else {
      this.objectContributors().push(this.newObjectContributor());
    }
  }

  removeObjectContributor(i: number) {
    if (!this.objectContributors().value[i].alreadyExist) {
      this.objectContributors().removeAt(i);
    } else {
      const removeModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
      removeModal.componentInstance.type = 'objectContributor';
      removeModal.componentInstance.id = this.objectContributors().value[i].id;
      removeModal.componentInstance.sdOid = this.objectContributors().value[i].sdOid;
      removeModal.result.then((data) => {
        if (data) {
          this.objectContributors().removeAt(i);
        }
      }, error => {})
    }
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
  onChange(index) {
    this.isIndividual[index] = this.form.value.studyContributors[index].isIndividual === 'true' ? true : false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
