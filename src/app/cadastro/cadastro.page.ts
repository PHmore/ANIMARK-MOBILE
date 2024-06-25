// Importação dos módulos

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, NavController } from '@ionic/angular/standalone';


import { Usuario } from '../home/usuario.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,FormsModule, HttpClientModule],
  providers: [Storage]
})
export class CadastroPage {

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

  async cadastrarUsuario() {
    const loading = await this.controle_carregamento.create({ message: 'Cadastrando...', duration: 15000 });
    await loading.present();

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(
      'http://127.0.0.1:8000/api/cadastro/',  // Altere para a URL da sua API
      this.instancia,
      { headers: httpHeaders }
    ).subscribe({
      next: async (resposta: any) => {
        
        let usuario = Object.assign(new Usuario(), resposta);
        await this.storage.set('usuario', usuario);

        loading.dismiss();

        const toast = await this.controle_toast.create({
          message: 'Cadastro realizado com sucesso!',
          duration: 2000,
          cssClass: 'ion-text-center'
        });
        toast.present();

        this.controle_navegacao.navigateRoot('/to-do-list');  // Altere para a rota desejada após o cadastro
      },
      error: async (erro: any) => {
        await loading.dismiss();
        console.log("ERROR RETORNADO: ",erro);
        
        const toast = await this.controle_toast.create({
          message: erro?.error?.detail || `Falha ao realizar cadastro: ${erro.message}`,
          duration: 2000,
          cssClass: 'ion-text-center'
        });
        toast.present();
      }
    });
  }

  goToLogin(){
    this.controle_navegacao.navigateRoot('/home');
  }
}



//   async ngOnInit() {
//     await this.storage.create(); // Inicializa o armazenamento local
//   }

//   async cadastrarUsuario() {
//     if (!this.formularioCadastro.valid) return; // Verifica se o formulário é válido

//     const loading = await this.loadingCtrl.create({ message: 'Cadastrando...', duration: 15000 });
//     await loading.present();

//     const httpHeaders = new HttpHeaders({
//       'Content-Type': 'application/json'
//     });

//     this.http.post(
//       'http://127.0.0.1:8000/api/cadastro/',  // Altere para a URL da sua API
//       this.formularioCadastro.value,
//       { headers: httpHeaders }
//     ).subscribe({
//       next: async (resposta: any) => {
//         await loading.dismiss();

//         // Armazena o token e os dados do usuário localmente
//         await this.storage.set('token', resposta.token);
//         await this.storage.set('usuario', {
//           id: resposta.id,
//           username: resposta.username
//         });

//         const toast = await this.toastCtrl.create({
//           message: 'Cadastro realizado com sucesso!',
//           duration: 2000,
//           cssClass: 'ion-text-center'
//         });
//         toast.present();
//         this.navCtrl.navigateRoot('/home');  // Altere para a rota desejada após o cadastro
//       },
//       error: async (erro: any) => {
//         await loading.dismiss();
//         const toast = await this.toastCtrl.create({
//           message: erro?.error?.detail || 'Falha ao realizar cadastro: Erro desconhecido',
//           duration: 2000,
//           cssClass: 'ion-text-center'
//         });
//         toast.present();
//       }
//     });
//   }
// }
