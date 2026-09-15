import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, pluck } from 'rxjs/operators';
import { Veiculo, VeiculoDados, VeiculosAPI } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  listarVeiculos(): Observable<Veiculo[]> {
    return this.http
      .get<VeiculosAPI>(`${this.apiUrl}/vehicles`)
      .pipe(pluck('vehicles'), catchError(this.tratarErro));
  }

  buscarDadosPorVin(vin: string): Observable<VeiculoDados> {
    return this.http
      .post<VeiculoDados>(`${this.apiUrl}/vehicleData`, { vin })
      .pipe(catchError(this.tratarErro));
  }

  private tratarErro(erro: HttpErrorResponse) {
    const mensagem =
      erro.error?.message || 'Falha na comunicação com o servidor. Verifique se a API está rodando (npm start).';
    return throwError(() => new Error(mensagem));
  }
}
