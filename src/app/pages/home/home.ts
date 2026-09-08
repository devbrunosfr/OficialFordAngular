import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Menu } from '../../componentes/menu/menu';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Menu],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class HomeComponent {
  isSidebarOpen = false;
  isUserMenuOpen = false;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout(): void {
    this.isUserMenuOpen = false;
    this.router.navigate(['/login']);
  }
}