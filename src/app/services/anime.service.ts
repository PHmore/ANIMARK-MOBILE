import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private apiUrl = 'http://127.0.0.1:8000'; // URL da sua API

  constructor(private http: HttpClient) {}

  // Método para obter a lista de animes
  getAnimeList(pageNumber: number): Observable<any[]> {
    const url = `${this.apiUrl}/animes/api/anime-list/`; // Endpoint da sua API
    let params = new HttpParams();
    params = params.append('page', pageNumber.toString());

    // Headers opcionais com token de autenticação
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // Adicione aqui o token de autenticação, se necessário
    });

    return this.http.get<any>(url, { headers: httpHeaders, params }).pipe(
      map(response => {
        if (response && response.anime_data) {
          const animeData = response.anime_data;
          // Manipule os dados conforme necessário
          return animeData;
        }
        return []; // Ou poderia retornar null, {}, ou outro valor apropriado se desejar
      }),
      catchError(error => {
        // Aqui você pode tratar o erro de acordo com sua necessidade
        console.error('Erro na requisição:', error);
        return throwError(error); // Lança o erro novamente para o componente que está utilizando o serviço
      })
    );
  }
}
