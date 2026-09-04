import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  menuAberto = false;

  constructor(private router: Router) {}

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}