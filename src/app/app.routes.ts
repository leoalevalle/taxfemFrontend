import { Routes } from '@angular/router';
import { Conductora } from './components/conductora/conductora';
import { Operadora } from './components/operadora/operadora';
import { Pasajera } from './components/pasajera/pasajera';

export const routes: Routes = [
    { path: 'conductora', component: Conductora },
    { path: 'operadora', component: Operadora },
    { path: 'pasajera', component: Pasajera },
    { path: '', redirectTo: '/pasajera', pathMatch: 'full'},
    { path: '**', redirectTo: '/pasajera' }
];
