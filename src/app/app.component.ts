import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {}

  ngOnInit(){
    const prefersLufesa = localStorage.getItem('theme') === 'lufesa';
    document.body.classList.add(prefersLufesa ? 'lufesa-theme' : 'inova-theme');
  }
}
