import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  isLufesa: boolean = false;
  title = "Lufesa";
  ngOnInit() {
  }

  onToggleChange(event: any) {
    
    this.title = event.detail.checked ? 'Inova' : 'Lufesa';
  }
}
