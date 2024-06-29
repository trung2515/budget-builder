import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type BudgetData = {
  category: string;
  expenseValue: number[];
};

enum BudgetKey {
  income = 'income',
  expensesSystem = 'expensesSystem',
  expensesDev = 'expensesDev',
}

@Component({
  selector: 'app-budget-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-table.component.html',
  styleUrl: './budget-table.component.scss',
})
export class BudgetTableComponent {
  startMonth: number = -1;
  endMonth: number = -1;
  months: string[] = [];
  income: BudgetData[] = [
    { category: 'Sale', expenseValue: [] },
    { category: 'Commission', expenseValue: [] },
    { category: 'Training', expenseValue: [] },
    { category: 'Consulting', expenseValue: [] },
  ];
  expensesSystem: BudgetData[] = [
    { category: 'Management Fees', expenseValue: [] },
    { category: 'Cloud Hosting', expenseValue: [] },
  ];
  expensesDev: BudgetData[] = [
    { category: 'Full Time Dev Salaries', expenseValue: [] },
    { category: 'Part Time Dev Salaries', expenseValue: [] },
    { category: 'Remote Salaries', expenseValue: [] },
  ];

  budgetSections = [
    {
      title: 'Income',
      key: BudgetKey.income,
      data: this.income,
      newItemName: '',
    },
    {
      title: 'Expenses System',
      key: BudgetKey.expensesSystem,
      data: this.expensesSystem,
      newItemName: '',
    },
    {
      title: 'Expenses Dev',
      key: BudgetKey.expensesDev,
      data: this.expensesDev,
      newItemName: '',
    },
  ];

  constructor() {}

  ngOnInit() {
    this.calculateBudget();
  }

  updateMonths() {
    const startDate = new Date(this.startMonth + '-01');
    const endDate = new Date(this.endMonth + '-01');
    this.months = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const monthName = currentDate.toLocaleString('default', {
        month: 'long',
      });
      this.months.push(monthName);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    [this.income, this.expensesSystem, this.expensesDev].forEach((array) => {
      array.forEach((item) => {
        item.expenseValue = Array(this.months.length).fill(0);
      });
    });
  }

  addRow(section: any) {
    switch (section.key) {
      case BudgetKey.income:
        if (section.newItemName) {
          this.income.push({
            category: section.newItemName,
            expenseValue: Array(this.months.length).fill(0),
          });
          this.budgetSections[0].newItemName = '';
        }
        break;
      case BudgetKey.expensesSystem:
        if (section.title) {
          this.expensesSystem.push({
            category: section.newItemName,
            expenseValue: Array(this.months.length).fill(0),
          });
          this.budgetSections[1].newItemName = '';
        }
        break;
      case BudgetKey.expensesDev:
        if (section.newItemName) {
          this.expensesDev.push({
            category: section.newItemName,
            expenseValue: Array(this.months.length).fill(0),
          });
          this.budgetSections[2].newItemName = '';
        }
        break;
      default:
        break;
    }
  }

  calculateTotal(type: string, columnIndex: number): number {
    let total = 0;
    switch (type) {
      case BudgetKey.income:
        total = this.income.reduce(
          (acc, item) => acc + item.expenseValue[columnIndex],
          0
        );
        break;
      case BudgetKey.expensesSystem:
        total = this.expensesSystem.reduce(
          (acc, item) => acc + item.expenseValue[columnIndex],
          0
        );
        break;
      case BudgetKey.expensesDev:
        total = this.expensesDev.reduce(
          (acc, item) => acc + item.expenseValue[columnIndex],
          0
        );
        break;
      default:
        break;
    }
    return total;
  }

  calculateBudget() {
    const totalExpenses: number[] = [];
    const profitOrLoss: number[] = [];
    const openingBalance: number[] = [0];
    const closingBalance: number[] = [];

    this.months.forEach((_, i) => {
      const incomeTotal = this.calculateTotal(BudgetKey.income, i);
      const expensesSystemTotal = this.calculateTotal(
        BudgetKey.expensesSystem,
        i
      );
      const expensesDevTotal = this.calculateTotal(BudgetKey.expensesDev, i);

      const totalExpense = expensesSystemTotal + expensesDevTotal;
      totalExpenses.push(totalExpense);

      const profitLoss = incomeTotal - totalExpense;
      profitOrLoss.push(profitLoss);

      if (i > 0) {
        openingBalance[i] = closingBalance[i - 1];
      }

      closingBalance[i] = profitLoss + openingBalance[i];
    });

    return { totalExpenses, profitOrLoss, openingBalance, closingBalance };
  }

  trackByFn(index: number): number {
    return index;
  }
}
