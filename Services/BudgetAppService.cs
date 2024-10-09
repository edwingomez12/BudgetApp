using System;
using BudgetApp.Models;

namespace BudgetApp;

public class BudgetAppService: IBudgetAppService
{
    public BudgetSumaryDto GetTotalMoneySpent(List<Expenses> expenses)
    {
        BudgetSumaryDto budgetSumary = new BudgetSumaryDto();
        
        if(expenses.Capacity != 0 ) 
        {
            foreach(var expense in expenses)
            {
                budgetSumary.TotalMoneySpent += expense.Amount;
            }
            budgetSumary.HighestTransactionSpent = expenses.Max(expense => expense.Amount);
            budgetSumary.LowestTransactionSpent = expenses.Min(expense => expense.Amount);
        }

        return budgetSumary;
    }
}