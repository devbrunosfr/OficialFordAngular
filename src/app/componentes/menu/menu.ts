import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  @Input() aberto = false;
  @Output() fecharMenu = new EventEmitter<void>();

  fechar(): void {
    this.fecharMenu.emit();
  }
}