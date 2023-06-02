import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonLookupService } from 'src/app/_rms/services/entities/common-lookup/common-lookup.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup
  reason: any;
  isSubmitted: boolean = false;

  constructor( private fb: FormBuilder, private commonLookUpService: CommonLookupService, private toastr: ToastrService) { 
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      organization: '',
      message: ['', Validators.required],
      reason: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }
  get g() { return this.contactForm.controls; }
  onChange() {
    this.reason = this.contactForm.value.reason
  }
  goToUserGuide() {}
  goToMdr() {}
  submitContact() {
    this.isSubmitted = true;
    if (this.contactForm.valid) {
      const payload = {to: [this.contactForm.value.email],
      subject: this.contactForm.value.reason,
      text: this.contactForm.value.message}
      this.commonLookUpService.emailAPI(payload).subscribe((res: any) => {
        if (res.status === 'Success') {
          this.toastr.success('Thank you for contacting us. An email has been sent to you mail address.')
        }
      }, error => {
        this.toastr.error(error);
      })
    }
  }
}
