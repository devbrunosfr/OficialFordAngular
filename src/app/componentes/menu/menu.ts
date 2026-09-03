import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";


@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  mostrarElemento = false;

  mostrar() {
    this.mostrarElemento = !this.mostrarElemento
  }
}
