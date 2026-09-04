import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Veiculo {
  nome: string;
  totalVendas: number;
  conectados: number;
  updateSoftware: number;
  vin: string;
  odometro: number;
  combustivel: number;
  status: 'on' | 'off';
  lat: number;
  long: number;
  cor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  isUserMenuOpen = false;
  isVeiculoDropdownOpen = false;
  isSidebarOpen = false;

  veiculos: Veiculo[] = [
    {
      nome: 'Ranger',
      totalVendas: 980,
      conectados: 320,
      updateSoftware: 410,
      vin: '8AFBR10X6PJ304521',
      odometro: 32000,
      combustivel: 60,
      status: 'on',
      lat: -12.2322,
      long: -35.2314,
      cor: '#5b5b5b'
    },
    {
      nome: 'Mustang',
      totalVendas: 1500,
      conectados: 500,
      updateSoftware: 750,
      vin: '7FRHDUY57Y63NHD27455',
      odometro: 50000,
      combustivel: 90,
      status: 'on',
      lat: -12.2322,
      long: -35.2314,
      cor: '#181818'
    },
    {
      nome: 'Territory',
      totalVendas: 4560,
      conectados: 500,
      updateSoftware: 3050,
      vin: '2FMAA30X54LHED04975',
      odometro: 10000,
      combustivel: 25,
      status: 'off',
      lat: -12.2322,
      long: -35.2314,
      cor: '#3b74c9'
    },
    {
      nome: 'Bronco Sport',
      totalVendas: 2100,
      conectados: 480,
      updateSoftware: 1120,
      vin: '3FMCR9C68LRA02938',
      odometro: 18500,
      combustivel: 70,
      status: 'on',
      lat: -12.2322,
      long: -35.2314,
      cor: '#c47a1f'
    }
  ];

  // Veículo selecionado por padrão (Mustang, conforme a referência visual)
  veiculoSelecionado: Veiculo = this.veiculos[1];

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleVeiculoDropdown(): void {
    this.isVeiculoDropdownOpen = !this.isVeiculoDropdownOpen;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  selecionarVeiculo(veiculo: Veiculo): void {
    this.veiculoSelecionado = veiculo;
    this.isVeiculoDropdownOpen = false;
  }

  logout(): void {
    this.isUserMenuOpen = false;
    // TODO: integrar com o serviço de autenticação real do projeto
  }
}
