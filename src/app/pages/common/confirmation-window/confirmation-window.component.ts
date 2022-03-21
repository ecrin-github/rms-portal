import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataObjectService } from 'src/app/_rms/services/entities/data-object/data-object.service';
import { DtpService } from 'src/app/_rms/services/entities/dtp/dtp.service';
import { DupService } from 'src/app/_rms/services/entities/dup/dup.service';
import { StudyService } from 'src/app/_rms/services/entities/study/study.service';

@Component({
  selector: 'app-confirmation-window',
  templateUrl: './confirmation-window.component.html',
  styleUrls: ['./confirmation-window.component.scss']
})
export class ConfirmationWindowComponent implements OnInit {
  type: any;
  id: any;
  sdSid: any;
  sdOid: any;

  constructor( private activeModal: NgbActiveModal, private toastr: ToastrService, private dtpService: DtpService, private dupService: DupService, private studyService: StudyService, private objectService: DataObjectService) { }

  ngOnInit(): void {
  }

  deleteRecord() {
    switch (this.type) {
      case 'dtp':
        this.deleteDtp();
        break;
      case 'dup':
        this.deleteDup();
        break;
      case 'study':
        this.deleteStudy();
        break;
      case 'dataObject':
        this.deleteDataObject();
        break;
      case 'studyIdentifier':
        this.deleletStudyIdentifier();
        break;
      case 'studyTitle':
        this.deleteStudyTitle();
        break;
      case 'studyFeature':
        this.deleteStudyFeature();
        break;
      case 'studyTopic':
        this.deleteStudyTopic();
        break;
      case 'studyRelationship':
        this.deleteStudyRelationship();
        break;
      case 'studyContributor':
        this.deleteStudyContributor();
        break;
      case 'objectInstance':
        this.deleteObjectInstance();
        break;
      default:
        break;
    }
  }
  deleteDtp() {
    if (localStorage.getItem('deleteDtp')) {
      localStorage.removeItem('deleteDtp');
    }
    this.dtpService.deleteDtpById(this.id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('DTP deleted successfully');
        localStorage.setItem('deleteDtp', 'true');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  deleteDup() {
    if (localStorage.getItem('deleteDup')) {
      localStorage.removeItem('deleteDup');
    }
    this.dupService.deleteDupById(this.id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('DUP deleted successfully');
        localStorage.setItem('deleteDup', 'true');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  deleteStudy() {
    if (localStorage.getItem('studyDelete')) {
      localStorage.removeItem('studyDelete');
    }
    this.studyService.deleteStudyById(this.id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('Study deleted successfully');
        localStorage.setItem('studyDelete', 'true');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0])
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  deleteDataObject() {
    if (localStorage.getItem('deleteDataObject')) {
      localStorage.removeItem('deleteDataObject');
    }
    this.objectService.deleteDataObjectById(this.id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('Data Object deleted successfully');
        localStorage.setItem('deleteDataObject', 'true');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0])
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  deleletStudyIdentifier() {
    this.studyService.deleteStudyIdentifier(this.id, this.sdSid).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('Study Identifier deleted successfully');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  deleteStudyTitle() {
    this.studyService.deleteStudyTitle(this.id, this.sdSid).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('Study Title deleted successfully');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  deleteStudyFeature() {
    this.studyService.deleteStudyFeature(this.id, this.sdSid).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('Study Feature deleted successfully');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  deleteStudyTopic() {
    this.studyService.deleteStudyTopic(this.id, this.sdSid).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('Study Toic deleted successfully');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  deleteStudyRelationship() {
    this.studyService.deleteStudyRelationshi(this.id, this.sdSid).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('Study Relationship deleted successfully');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  deleteStudyContributor() {
    this.studyService.deleteStudyContributor(this.id, this.sdSid).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('Study Contributor deleted successfully');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.toastr.error(error.erro.title);
    })
  }
  deleteObjectInstance() {
    this.objectService.deleteObjectInstance(this.id, this.sdOid).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toastr.success('Object Instance is deleted successfully');
        this.activeModal.close('data');
      } else {
        this.toastr.error(res.messages[0]);
      }
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  closeModal() {
    this.activeModal.close();
  }
}
