import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'animes',
    loadComponent: () => import('./animes/animes.page').then( m => m.AnimesPage)
  },
  {
    path: 'to-do-list',
    loadComponent: () => import('./to-do-list/to-do-list.page').then( m => m.ToDoListPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then( m => m.CadastroPage)
  },
];
