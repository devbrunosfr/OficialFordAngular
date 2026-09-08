import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
interface Usuario {
  nome: string;
  senha: string;
}
 
interface LoginResponse {
  id: number;
  nome: string;
  email: string;
}
 
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3001'; 
 
  constructor(private http: HttpClient) {}
 
  login(usuario: Usuario): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, usuario);
  }
}