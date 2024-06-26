import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from '../home/usuario.model';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

@Component({
  selector: 'app-animes',
  templateUrl: './animes.page.html',
  styleUrls: ['./animes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, FormsModule, RouterModule],
  providers: [HttpClient, Storage]
})

export class AnimesPage implements OnInit {
  currentRoute: string = '';
  public usuario: Usuario = new Usuario();
  public animeList: any[] = [];
  public filteredAnimeList: any[] = [];
  public pageNumber = 1;
  animeNome = '';
  private isLoading = false;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public controle_toast: ToastController,
    public controle_navegacao: NavController,
    public controle_carregamento: LoadingController,
    public router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  async ngOnInit() {
    await this.storage.create();
    const registro = await this.storage.get('usuario');

    if (registro) {
      this.usuario = Object.assign(new Usuario(), registro);
      this.loadAnimeList();
    } else {
      this.controle_navegacao.navigateRoot('/home');
    }
  }

  async loadAnimeList() {
    if (this.isLoading) return; 

    this.isLoading = true;
    const loading = await this.controle_carregamento.create({ message: 'Pesquisando...', duration: 60000 });
    await loading.present();

    let params = new HttpParams();
    params = params.append('page', this.pageNumber.toString());

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    this.http.get('http://127.0.0.1:8000/animes/api/anime-list/', { headers: httpHeaders, params }).subscribe({
      next: async (resposta: any) => {
        this.animeList = this.animeList.concat(resposta.anime_data);
        this.filteredAnimeList = [...this.animeList];
        loading.dismiss();
        this.isLoading = false;
      },
      error: async (erro: any) => {
        loading.dismiss();
        this.isLoading = false;
        const mensagem = await this.controle_toast.create({
          message: `Falha ao consultar animes: ${erro.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
    });
  }

  async loadNextPage(event: any) {
    this.pageNumber++;
    await this.loadAnimeList();
    event.target.complete();
  }
  
  async criarTask(anime: any) {
    anime.in_list = true;
    const loading = await this.controle_carregamento.create({ message: 'Adicionando...', duration: 15000 });
    await loading.present();

    const http_headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    this.http.post(
      'http://127.0.0.1:8000/animes/api/anime-task-create/',
      anime,
      { headers: http_headers }
    ).subscribe({
      next: async (resposta: any) => {
        loading.dismiss();
        this.updateAnimeList(anime);
      },
      error: async (erro: any) => {
        loading.dismiss();
        const mensagem = await this.controle_toast.create({
          message: `Falha ao criar Task: ${erro.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
    });
  }

  updateAnimeList(anime: any) {
    const index = this.animeList.findIndex(a => a.mal_id === anime.mal_id);
    if (index !== -1) {
      this.animeList[index].in_list = true;
      this.filteredAnimeList = [...this.animeList];
    }
  }

  async searchAnimes() {
    if (this.isLoading) return;

    this.isLoading = true;
    const loading = await this.controle_carregamento.create({ message: 'Pesquisando...', duration: 60000 });
    await loading.present();

    let params = new HttpParams()
      .set('anime_nome', this.animeNome)
      .set('page', this.pageNumber.toString());

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    this.http.get('http://127.0.0.1:8000/animes/api/anime-src/', { headers: httpHeaders, params })
      .subscribe({
        next: async (resposta: any) => {
          this.animeList = resposta.anime_data;  // Considerando que 'anime_data' é o array de animes retornado pela API
          this.filteredAnimeList = [...this.animeList];
          loading.dismiss();
          this.isLoading = false;
        },
        error: async (erro: any) => {
          loading.dismiss();
          this.isLoading = false;
          const mensagem = await this.controle_toast.create({
            message: `Falha ao consultar animes: ${erro.message}`,
            cssClass: 'ion-text-center',
            duration: 2000
          });
          mensagem.present();
        }
      });
  }


  goToAnimes() {
    this.controle_navegacao.navigateRoot('/animes');
  }

  goToTodoList() {
    this.controle_navegacao.navigateRoot('/to-do-list');
  }

  logout() {
    this.storage.remove('usuario');
    this.controle_navegacao.navigateRoot('/home');    
  }
}
