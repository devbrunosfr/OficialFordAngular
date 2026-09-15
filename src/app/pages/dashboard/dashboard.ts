import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { Menu } from '../../componentes/menu/menu';
import { Auth } from '../../services/auth';
import { VeiculoService } from '../../services/veiculo-service';
import { Veiculo, VeiculoDados } from '../../models/veiculo.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Menu],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('topoVeiculo') topoVeiculo?: ElementRef<HTMLElement>;

  isUserMenuOpen = false;
  isVeiculoDropdownOpen = false;
  isSidebarOpen = false;

  private readonly imagensPorModelo: Record<string, string> = {
    Ranger: 'img/ranger.png',
    Mustang: 'img/mustang.png',
    Territory: 'img/territory.png',
    'Bronco Sport': 'img/broncoSport.png',
  };
  private readonly imagemPadrao = 'img/ford.png';

  private readonly pinsPorModelo: Record<string, string> = {
    Ranger: '2FRHDUYS2Y63NHD22454',
    Mustang: '2RFAASDY54E4HDU34874',
    Territory: '2FRHDUYS2Y63NHD22455',
    'Bronco Sport': '2RFAASDY54E4HDU34875',
  };

  veiculos: Veiculo[] = [];
  veiculosFiltrados: Veiculo[] = [];
  veiculoSelecionado: Veiculo | null = null;
  buscaVeiculoControl = new FormControl('', { nonNullable: true });

  carregandoVeiculos = true;
  erroVeiculos: string | null = null;

  buscaPinControl = new FormControl('', { nonNullable: true });
  veiculoTabela: VeiculoDados | null = null;
  pinConsultado: string | null = null;
  carregandoTabela = false;
  mensagemBusca: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private auth: Auth,
    private veiculoService: VeiculoService
  ) {}

  ngOnInit(): void {
    this.carregarVeiculos();
    this.configurarBuscaDeVeiculo();
    this.configurarBuscaDePin();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private carregarVeiculos(): void {
    this.carregandoVeiculos = true;
    this.erroVeiculos = null;

    this.veiculoService
      .listarVeiculos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (veiculos) => {
          this.veiculos = veiculos;
          this.veiculosFiltrados = veiculos;
          this.veiculoSelecionado = veiculos[0] ?? null;
          this.carregandoVeiculos = false;

          this.atualizarPinDoVeiculoSelecionado();
        },
        error: (erro: Error) => {
          this.erroVeiculos = erro.message;
          this.carregandoVeiculos = false;
        },
      });
  }

  private configurarBuscaDeVeiculo(): void {
    this.buscaVeiculoControl.valueChanges
      .pipe(
        debounceTime(200),
        map((texto) => texto.trim().toLowerCase()),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((termo) => {
        this.veiculosFiltrados = termo
          ? this.veiculos.filter((v) => v.vehicle.toLowerCase().includes(termo))
          : this.veiculos;
        this.isVeiculoDropdownOpen = true;
      });
  }

  private configurarBuscaDePin(): void {
    this.buscaPinControl.valueChanges
      .pipe(
        map((valor) => valor.trim()),
        debounceTime(400),
        distinctUntilChanged(),
        filter((pin) => pin.length > 0),
        switchMap((pin) => {
          this.carregandoTabela = true;
          this.mensagemBusca = null;
          return this.veiculoService.buscarDadosPorVin(pin).pipe(
            map((dados) => ({ pin, dados })),
            catchError((erro: Error) => {
              this.mensagemBusca = this.padronizarMensagem(erro.message);
              this.veiculoTabela = null;
              return of(null);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((resultado) => {
        this.carregandoTabela = false;
        if (resultado) {
          this.veiculoTabela = resultado.dados;
          this.pinConsultado = resultado.pin;
          this.mensagemBusca = null;
          this.sincronizarVeiculoSelecionadoPeloPin(resultado.pin);
        }
      });
  }

  buscarVeiculoPorPin(): void {
    const pin = this.buscaPinControl.value.trim();

    if (!pin) {
      this.mensagemBusca = 'Informe o código do veículo (PIN) para buscar.';
      this.veiculoTabela = null;
      return;
    }

    this.executarBuscaPin(pin, true);
  }

  private executarBuscaPin(pin: string, sincronizarSelecao = false): void {
    this.carregandoTabela = true;
    this.mensagemBusca = null;

    this.veiculoService
      .buscarDadosPorVin(pin)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dados) => {
          this.veiculoTabela = dados;
          this.pinConsultado = pin;
          this.carregandoTabela = false;
          if (sincronizarSelecao) {
            this.sincronizarVeiculoSelecionadoPeloPin(pin);
          }
        },
        error: (erro: Error) => {
          this.mensagemBusca = this.padronizarMensagem(erro.message);
          this.veiculoTabela = null;
          this.carregandoTabela = false;
        },
      });
  }

  private sincronizarVeiculoSelecionadoPeloPin(pin: string): void {
    const modelo = Object.keys(this.pinsPorModelo).find(
      (nome) => this.pinsPorModelo[nome] === pin
    );
    const veiculo = modelo ? this.veiculos.find((v) => v.vehicle === modelo) : undefined;

    if (!veiculo) {
      return;
    }

    this.veiculoSelecionado = veiculo;
    this.topoVeiculo?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private atualizarPinDoVeiculoSelecionado(): void {
    const pin = this.veiculoSelecionado
      ? this.pinsPorModelo[this.veiculoSelecionado.vehicle]
      : undefined;

    if (pin) {
      this.buscaPinControl.setValue(pin, { emitEvent: false });
      this.executarBuscaPin(pin);
    } else {
      this.buscaPinControl.setValue('', { emitEvent: false });
      this.veiculoTabela = null;
      this.pinConsultado = null;
      this.mensagemBusca = null;
    }
  }

  private padronizarMensagem(mensagem: string): string {
    return mensagem.replace(/VIN/gi, 'PIN');
  }

  imagemDoVeiculo(veiculo: Veiculo | null): string {
    if (!veiculo) {
      return this.imagemPadrao;
    }
    return this.imagensPorModelo[veiculo.vehicle] ?? this.imagemPadrao;
  }

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
    this.buscaVeiculoControl.setValue('', { emitEvent: false });
    this.veiculosFiltrados = this.veiculos;

    this.atualizarPinDoVeiculoSelecionado();
  }

  logout(): void {
    this.isUserMenuOpen = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
