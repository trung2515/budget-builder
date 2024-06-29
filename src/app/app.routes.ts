import { Routes } from '@angular/router';
import { BudgetTableComponent } from './components/budget-table/budget-table.component';

export const routes: Routes = [
  { path: 'budget-table', component: BudgetTableComponent },
  { path: '', redirectTo: '/budget-table', pathMatch: 'full' },
];
