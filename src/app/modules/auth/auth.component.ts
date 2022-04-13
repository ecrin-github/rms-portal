import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  today: Date = new Date();
  showFooter: boolean = true;

  constructor( private router: Router) { }

  ngOnInit(): void {
    this.showFooter = this.router.url.includes('contactUs') ? false : true;
  }
  goToContact() {
    this.router.navigate([])
    .then(result => { window.open('/contactUs', '_blank'); });
}

}
