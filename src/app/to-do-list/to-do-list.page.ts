import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Anime, Episodio } from '../animes/animes.model';
import { Usuario } from '../home/usuario.model';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.page.html',
  styleUrls: ['./to-do-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, FormsModule, RouterModule],
  providers: [HttpClient, Storage]
})
export class ToDoListPage implements OnInit {
  currentRoute: string = '';
  public usuario: Usuario = new Usuario();
  public todo_anime: Anime[] = [];

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
      this.consultarTodoList();
    } else {
      this.controle_navegacao.navigateRoot('/home');
    }
  }

  async consultarTodoList() {
    const loading = await this.controle_carregamento.create({ message: 'Pesquisando...', duration: 60000 });
    await loading.present();

    const http_headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    this.http.get('http://127.0.0.1:8000/to_do_list/api/', { headers: http_headers }).subscribe({
      next: async (resposta: any) => {
        this.todo_anime = resposta;
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

  async excluirTask(id: number) {
    const loading = await this.controle_carregamento.create({ message: 'Autenticando...', duration: 30000 });
    await loading.present();

    const http_headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    this.http.delete(`http://127.0.0.1:8000/to_do_list/api/excluir/${id}/`, { headers: http_headers }).subscribe({
      next: async () => {
        this.consultarTodoList();
        loading.dismiss();
      },
      error: async (erro: any) => {
        loading.dismiss();
        const mensagem = await this.controle_toast.create({
          message: `Falha ao excluir a Task: ${erro.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
    });
  }

  async toggleEpisodioAssistido(anime_id: number, episodio_id: number) {
    const loading = await this.controle_carregamento.create({ message: 'Alternando...', duration: 30000 });
    await loading.present();

    const http_headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    const requestBody = {};

    this.http.put(
      `http://127.0.0.1:8000/to_do_list/api/marcar/${anime_id}/${episodio_id}/`,
      requestBody,
      { headers: http_headers }
    ).subscribe({
      next: async () => {
        this.consultarTodoList();
        loading.dismiss();
      },
      error: async (erro: any) => {
        loading.dismiss();
        const mensagem = await this.controle_toast.create({
          message: `Falha ao alternar assistido: ${erro.message}`,
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
    this.controle_navegacao.navigateRoot('/home')
    
  }
}
