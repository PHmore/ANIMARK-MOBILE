// Import necessário para formatação de datas, se necessário
import { formatDate } from '@angular/common';

export class Anime {
//   mal_id?: number; // null e blank permitidos
  id: number;
  mal_id: number; // null e blank permitidos
  titulo: string;
  assistido: boolean;
  created_at: Date;
  updated_at: Date;
  // Tem q ser definido como um array de episódios
  episodios: Episodio[];

  constructor(data: any) {
    this.id = data.id;
    this.mal_id = data.mal_id;
    this.titulo = data.titulo;
    this.assistido = data.assistido || false;
    this.episodios = data.episodios;
    this.created_at = new Date(data.created_at);
    this.updated_at = new Date(data.updated_at);
  }

  toString(): string {
    return `${this.titulo} - ${this.assistido}`;
  }

  tempoAssistindo(): number {
    const createdDate = new Date(this.created_at);
    return Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  get animeNovo(): boolean {
    const createdDate = new Date(this.created_at);
    return createdDate.getDate() === new Date().getDate();
  }
}

export class Episodio {
  id: number;
  anime: Anime;
  numero: number;
  assistido: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(data: any, anime: Anime) {
    this.id = data.id;
    this.anime = anime;
    this.numero = data.numero;
    this.assistido = data.assistido || false;
    this.created_at = new Date(data.created_at);
    this.updated_at = new Date(data.updated_at);
  }

  toString(): string {
    return `${this.anime.titulo} - Episódio ${this.numero}`;
  }
}
