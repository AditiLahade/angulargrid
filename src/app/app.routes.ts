import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { GridComponent } from './grid/grid.component';

export const routes: Routes = [
    {path:'navbar',component:NavbarComponent},
    {path:'grid', component:GridComponent}
];
