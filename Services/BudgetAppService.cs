using System;
using System.IO.Pipes;
using BudgetApp.Models;
namespace BudgetApp;

public class BudgetAppService: IBudgetAppService
{
    public Dictionary<DateGroup, BudgetSumaryDto> GetTotalMoneySpent(List<Expenses> expenses)
    {
        BudgetSumaryDto budgetSumary = new BudgetSumaryDto();
        Dictionary<DateGroup, BudgetSumaryDto> budgetSummary = new Dictionary<DateGroup, BudgetSumaryDto>();
        if(expenses.Capacity != 0 ) 
        {
            var organizedTransactions = OrganizeTransactions(expenses);
            foreach(var group in organizedTransactions)
            {
                var moneySpent = Calculations.AddTotal(group.Value);
                var highestTransactionSpent = Calculations.GetLargestValue(group.Value);
                var secondHighestTransaction = Calculations.GetSecondLargestValue(group.Value);
                var thirdHighestTransaction = Calculations.GetThirdLargestValue(group.Value);
                var secondHighestDescription = Calculations.GetDescription(group.Value, secondHighestTransaction);
                var thirdHighestDescription = Calculations.GetDescription(group.Value, thirdHighestTransaction);
                var highestDescription = Calculations.GetDescription(group.Value, highestTransactionSpent);
                var lowestTransaction =  Calculations.GetMinValue(group.Value);
                var lowestDescription = Calculations.GetDescription(group.Value, lowestTransaction);
                var creditCardsTotal = Calculations.GetCreditCardPayments(group.Value);
                var monthlyIncome = Calculations.GetMonthlyIncome(group.Value);
                BudgetSumaryDto summary = new()
                {
                    TotalMoneySpent = moneySpent,
                    HighestTransactionSpent = highestTransactionSpent,
                    HighestDescription = highestDescription,
                    LowestTransactionSpent = lowestTransaction,
                    LowestDescription = lowestDescription,
                    SecondHighestTransaction = secondHighestTransaction,
                    SecondHighestDescription = secondHighestDescription,
                    ThirdHighestTransaction = thirdHighestTransaction,
                    ThirdHighestDescription = thirdHighestDescription,
                    CreditCardTotal = creditCardsTotal,
                    MonthlyIncome = monthlyIncome
                };
                budgetSummary.Add(group.Key, summary);
            }
        }
        

        return budgetSummary;
    }

    public Dictionary<DateGroup, List<Expenses>> OrganizeTransactions(List<Expenses> list)
    {
         var organizedTransactions = list
            .GroupBy(t => new DateGroup{ Year = t.PostingDate.Year, Month = t.PostingDate.Month })
            .OrderBy(g => g.Key.Year)  // Order by year
            .ThenBy(g => g.Key.Month)  // Order by month within each year
            .ToDictionary(g => g.Key, g => g.ToList()); 
            return organizedTransactions;
    }
}