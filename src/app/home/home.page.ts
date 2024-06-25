// Importação dos módulos

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, NavController } from '@ionic/angular/standalone';

import { Usuario } from './usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [Storage]
})

export class HomePage {
  public instancia: {username: string, password: string} = {
    username: '',
    password: ''
  };

  constructor(
    public controle_carregamento: LoadingController,
    public controle_navegacao: NavController,
    public controle_alerta: AlertController,
    public controle_toast: ToastController,
    public storage: Storage,
    public http: HttpClient
  ) {}

  async ngOnInit() {
    await this.storage.create();  // Criação de banco de dados local
  }

  async autenticarUsuario() {

    console.log("Usuário e senha: ",this.instancia);
    

    // Inicializa interface com efeito de carregamento
    const loading = await this.controle_carregamento.create({ message: 'Autenticando...', duration: 15000 });
    await loading.present();

    // Define informações do cabeçalho da requisição
    let http_headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Autentica usuário junto a API do sistema web
    this.http.post(
      'http://127.0.0.1:8000/api/login/',
      this.instancia,
      { headers: http_headers }
      
      // O subscribe define um observador que espera uma resposta ou um erro
    ).subscribe({
      // Este lida com o próximo valor obtido pelo subscribe ou seja a resposta da solicitação
      next: async (resposta: any) => {
        // Armazena localmente as credenciais do usuário
        let usuario = Object.assign(new Usuario(), resposta);
        console.log('Usuário autenticado com sucesso');
        
        await this.storage.set('usuario', usuario);

        // Finaliza autenticação e redireciona para interface inicial
        loading.dismiss();
        this.controle_navegacao.navigateRoot('/to-do-list');
      },
      // Este lida com erros
      error: async (erro: any) => {
        loading.dismiss();
        console.log("ERRO NO LOGIN",erro);
        
        const mensagem = await this.controle_toast.create({
          message: erro?.error?.detail || `Falha ao autenticar usuario: ${erro.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
      });
  }

  goToCadastro(){
    this.controle_navegacao.navigateRoot('/cadastro');
  }
}
