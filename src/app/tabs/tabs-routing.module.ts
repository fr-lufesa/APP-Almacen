import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { networkGuard } from '../guards/network.guard';
import { NoConnectionComponent } from '../no-connection/no-connection.component';

const routes: Route[] = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivateChild: [networkGuard],
    children: [
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'stockin',
        loadChildren: () => import('../stockin/stockin.module').then(m => m.StockinPageModule)
      },
      {
        path: 'stockout',
        loadChildren: () => import('../stockout/stockout.module').then(m => m.StockoutPageModule)
      },

      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ],
  }, {
    path: 'no-connection',
    component: NoConnectionComponent,
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
