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
            budgetSumary.TotalMoneySpent = Calculations.AddTotal(expenses);
            budgetSumary.HighestTransactionSpent = Calculations.GetLargestValue(expenses);
            budgetSumary.HighestDescription = Calculations.GetDescription(expenses, budgetSumary.HighestTransactionSpent);
            budgetSumary.LowestTransactionSpent = Calculations.GetMinValue(expenses);
            budgetSumary.LowestDescription = Calculations.GetDescription(expenses, budgetSumary.LowestTransactionSpent);
        }

        return budgetSumary;
    }
}