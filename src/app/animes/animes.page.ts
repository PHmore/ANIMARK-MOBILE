import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from '../home/usuario.model';
// import { Anime } from '../animes/animes.model';
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
  // Se não estiver como public não acessará o usuário carregado pela outra página
  public usuario: Usuario = new Usuario();
  public animeList: any[] = [];
  public pageNumber = 1;

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

  // É necessário importar o usuário coisa a qual eu estava esquecendo
  async ngOnInit() {
    await this.storage.create();
    const registro = await this.storage.get('usuario');

    if (registro) {
      this.usuario = Object.assign(new Usuario(), registro);
      this.loadAnimeList(this.pageNumber);
    } else {
      this.controle_navegacao.navigateRoot('/home');
    }
  }

  nextPage() {
    this.pageNumber++;
    this.loadAnimeList(this.pageNumber);
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadAnimeList(this.pageNumber);
    }
  }

  async loadAnimeList(pageNumber: number) {
    const loading = await this.controle_carregamento.create({ message: 'Pesquisando...', duration: 60000 });
    await loading.present();
    
    let params = new HttpParams();
    params = params.append('page', pageNumber.toString());
  
    const http_headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });
  
    this.http.get('http://127.0.0.1:8000/animes/api/anime-list/', { headers: http_headers, params }).subscribe({
      next: async (resposta: any) => {
        this.animeList = resposta.anime_data;
        console.log("LISTA DE ANIMES RETORNADAS: ", this.animeList);
        loading.dismiss();
      },
      error: async (erro: any) => {
        loading.dismiss();
        const mensagem = await this.controle_toast.create({
          message: `Falha ao consultar tasks: ${erro.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
    });
  }
  
  async criarTask(anime: object)
  {
    console.log("ANIME A SALVAR: ",anime);
    

    // Inicializa interface com efeito de carregamento
    const loading = await this.controle_carregamento.create({ message: 'Adicionando...', duration: 15000 });
    await loading.present();

    // Define informações do cabeçalho da requisição
    const http_headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    this.http.post(
      'http://127.0.0.1:8000/animes/api/anime-task-create/',
      anime,
      { headers: http_headers }
      
      // O subscribe define um observador que espera uma resposta ou um erro
    ).subscribe({
      // Este lida com o próximo valor obtido pelo subscribe ou seja a resposta da solicitação
      next: async (resposta: any) => {
        
        loading.dismiss();
        this.loadAnimeList(this.pageNumber);
        // this.controle_navegacao.navigateRoot('/to-do-list');
      },
      // Este lida com erros
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

  goToAnimes() {
    this.controle_navegacao.navigateRoot('/animes');
  }

  goToTodoList() {
    this.controle_navegacao.navigateRoot('/to-do-list');
  }

  logout()
  {
    this.storage.remove('usuario');
    this.controle_navegacao.navigateRoot('/home');    
  }

}