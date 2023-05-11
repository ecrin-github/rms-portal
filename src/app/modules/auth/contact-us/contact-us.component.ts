import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup
  reason: any;

  constructor( private fb: FormBuilder, ) { 
    this.contactForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      organization: '',
      message: '',
      reason: ''
    })
  }

  ngOnInit(): void {
  }
  onChange() {
    this.reason = this.contactForm.value.reason
  }
  goToUserGuide() {}
  goToMdr() {}
}
