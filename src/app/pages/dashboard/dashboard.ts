import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Menu } from '../../componentes/menu/menu';
import { Auth } from '../../services/auth';

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
  imagem: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  isUserMenuOpen = false;
  isVeiculoDropdownOpen = false;
  isSidebarOpen = false;

  constructor(private router: Router, private auth: Auth) {}

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
      cor: '#5b5b5b',
      imagem: 'img/ranger.png'
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
      cor: '#181818',
      imagem: 'img/mustang.png'
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
      cor: '#3b74c9',
      imagem: 'img/territory.png'
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
      cor: '#c47a1f',
      imagem: 'img/broncoSport.png'
    }
  ];

  // Veículo selecionado por padrão (Mustang, conforme a referência visual)
  veiculoSelecionado: Veiculo = this.veiculos[1];

  // Veículo exibido na tabela — segue o selecionado acima, a menos que uma busca por código esteja ativa
  veiculoTabela: Veiculo = this.veiculoSelecionado;
  codigoBusca: string = '';
  mensagemBusca: string | null = null;

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

    // Ao trocar o veículo no cartão, a tabela volta a acompanhá-lo e a busca é limpa
    this.codigoBusca = '';
    this.mensagemBusca = null;
    this.veiculoTabela = veiculo;
  }

  buscarVeiculo(): void {
    const termo = this.codigoBusca.trim().toLowerCase();

    if (!termo) {
      this.mensagemBusca = null;
      this.veiculoTabela = this.veiculoSelecionado;
      return;
    }

    const encontrado = this.veiculos.find(v => v.vin.toLowerCase() === termo);

    if (encontrado) {
      this.veiculoTabela = encontrado;
      this.mensagemBusca = null;
    } else {
      this.mensagemBusca = 'Nenhum veículo encontrado com esse código.';
    }
  }

  logout(): void {
    this.isUserMenuOpen = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
