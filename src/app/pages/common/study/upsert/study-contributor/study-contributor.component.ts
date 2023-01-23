import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StudyContributorInterface } from 'src/app/_rms/interfaces/study/study-contributor.interface';
import { CommonLookupService } from 'src/app/_rms/services/entities/common-lookup/common-lookup.service';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';
import { ConfirmationWindowComponent } from '../../../confirmation-window/confirmation-window.component';

@Component({
  selector: 'app-study-contributor',
  templateUrl: './study-contributor.component.html',
  styleUrls: ['./study-contributor.component.scss']
})
export class StudyContributorComponent implements OnInit {
  form: FormGroup;
  contributorType: [] = [];
  subscription: Subscription = new Subscription();
  @Input() sdSid: string;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  studyContributor: StudyContributorInterface;
  isIndividual = [];
  notindividualArr: [] = [];
  individualArr: [] = [];
  notIndividualColumns = ['contribTypeId', 'organisationName'];
  individualColumns = ['contribTypeId', 'personGivenName', 'orcidId', 'organisationName', 'personAffiliation'];
  @Input() set initiateEmit(initiateEmit: any) {
    if (initiateEmit) {
      this.emitData();
    }
  }
  @Output() emitContributor: EventEmitter<any> = new EventEmitter();
  arrLength = 0;
  len: any;

  constructor( private fb: FormBuilder, private commonLookupService: CommonLookupService, private objectService: DataObjectService, private studyService: StudyService, private spinner: NgxSpinnerService, private toastr: ToastrService, private modalService: NgbModal) { 
    this.form = this.fb.group({
      studyContributors: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getContributorType();
    if (this.isEdit || this.isView) {
      this.getStudyContributor();
    }
  }
  studyContributors(): FormArray {
    return this.form.get('studyContributors') as FormArray;
  }

  newStudyContributor(): FormGroup {
    return this.fb.group({
      id: '',
      sdSid: '',
      contribTypeId: null,
      isIndividual: false,
      organisationName: '',
      personGivenName: '',
      personFamilyName: '',
      orcidId: null,
      personAffiliation: '',
      alreadyExist: false
    });
  }

  addStudyContributor() {
    this.len = this.studyContributors().value.length;
    if (this.len) {
      if (this.studyContributors().value[this.len-1].isIndividual === 'true' || this.studyContributors().value[this.len-1].isIndividual === true ? this.studyContributors().value[this.len-1].contribTypeId && this.studyContributors().value[this.len-1].organisationName && this.studyContributors().value[this.len-1].personFamilyName && this.studyContributors().value[this.len-1].personGivenName : this.studyContributors().value[this.len-1].contribTypeId && this.studyContributors().value[this.len-1].organisationName) {
        this.arrLength = this.studyContributors().value.length;
        this.studyContributors().push(this.newStudyContributor());
      } else {
        if (this.studyContributors().value[this.len - 1].alreadyExist) {
          this.arrLength = this.studyContributors().value.length;
          this.studyContributors().push(this.newStudyContributor());
        } else {
          if (this.studyContributors().value[this.len - 1].isIndividual === 'true' || this.studyContributors().value[this.len - 1].isIndividual === true) {
            this.toastr.info('Please provide Contributor Type, Organization, Persons First Name and Family Name in the previously added Study Contibutor');
          } else {
            this.toastr.info('Please provide Contributor Type and Organization in the previously added Study Contibutor');
          }
        }
      }
    } else {
      this.arrLength = this.studyContributors().value.length;
      this.studyContributors().push(this.newStudyContributor());
    }
  }

  removeStudyContributor(i: number) {
    if (!this.studyContributors().value[i].alreadyExist) {
      this.studyContributors().removeAt(i);
    } else {
      const removeModal = this.modalService.open(ConfirmationWindowComponent, {size: 'lg', backdrop: 'static'});
      removeModal.componentInstance.type = 'studyContributor';
      removeModal.componentInstance.id = this.studyContributors().value[i].id;
      removeModal.componentInstance.sdSid = this.studyContributors().value[i].sdSid;
      removeModal.result.then((data) => {
        if (data) {
          this.studyContributors().removeAt(i);
        }
      }, error => {});
    }
  }
  getContributorType() {
    const getContributorType$ = this.commonLookupService.getContributorTypes().subscribe((res:any) => {
      if(res.data) {
        this.contributorType = res.data;
      }
    }, error => {
      console.log('error', error);
    });
    this.subscription.add(getContributorType$);
  }
  getStudyContributor() {
    this.spinner.show();
    this.studyService.getStudyContributors(this.sdSid).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.data) {
        this.studyContributor = res.data.length ? res.data : [];
        this.patchForm(this.studyContributor);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  patchForm(contributors) {
    this.form.setControl('studyContributors', this.patchArray(contributors));
  }
  patchArray(contributors): FormArray {
    const formArray = new FormArray([]);
    contributors.forEach(contributor => {
      formArray.push(this.fb.group({
        id: contributor.id,
        sdSid: contributor.sdSid,
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
    if (this.isView) {
      this.individualArr = contributors.filter((item: any) => item.isIndividual === true);
      this.notindividualArr = contributors.filter((item: any) => item.isIndividual === false);
    }
    return formArray;
  }
  addContributor(index) {
    this.spinner.show();
    const payload = this.form.value.studyContributors[index];
    payload.sdSid = this.sdSid;
    payload.isIndividual = payload.isIndividual === 'true' ? true : false;
    delete payload.id;

    this.studyService.addStudyContributor(this.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Contributor added successfully');
        this.getStudyContributor();
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.title);
    })
  }
  editContributor(contributorStudy) {
    const payload = contributorStudy.value;
    payload.isIndividual = payload.isIndividual === 'true' ? true : false;
    this.spinner.show();
    this.studyService.editStudyContributor(payload.id, payload.sdSid, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        this.toastr.success('Study Contributor updated successfully');
        this.getStudyContributor();
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
    const payload = this.form.value.studyContributors.map(item => {
      item.isIndividual = item.isIndividual === 'true' ? true : false;
      if (!item.id) {
        delete item.id;
      }
      if(this.sdSid) {
        item.sdSid = this.sdSid;
      }
      return item;
    })
    this.emitContributor.emit({data: payload, isEmit: false});
  }
  onChange(index) {
    this.isIndividual[index] = this.form.value.studyContributors[index].isIndividual === 'true' ? true : false;
    this.studyContributors().at(index).patchValue({
      contribTypeId: '',
      organisationName: '',
      personGivenName: '',
      personFamilyName: '',
      orcidId: '',
      personAffiliation: '',
    })
  }
  sameAsAbove() {
    const arr = this.studyContributors().value.filter(item => item.isIndividual === true);
    const preValue = arr[arr.length - 1];
    this.studyContributors().at(this.arrLength).patchValue({
      isIndividual: preValue.isIndividual,
      organisationName: preValue.organisationName,
      contribTypeId: preValue.contribTypeId,
      orcidId: preValue.orcidId,
      personAffiliation: preValue.personAffiliation,
      personFamilyName: preValue.personFamilyName,
      personGivenName: preValue.personGivenName
    })
  }
  scrollToElement(): void {
    setTimeout(() => {
      const yOffset = -200; 
      const element = document.getElementById('conpanel'+this.len);
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
