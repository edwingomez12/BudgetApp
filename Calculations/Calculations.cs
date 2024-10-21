using System;
using BudgetApp.Models;

namespace BudgetApp;

public static class Calculations
{
    public static decimal AddTotal(List<Expenses> totals)
    {
        decimal sum = 0;

        sum = totals.Where(expense => expense.Detail == Detail.DEBIT
        && !expense.Description.Contains("Online Transfer") && !expense.Description.Contains("Autosave Savings"))
        .Sum(expense => expense.Amount);
        return Math.Round(sum,2);
    }

    public static decimal GetLargestValue(List<Expenses> list)
    {
        return list.Where(expense => expense.Detail == Detail.DEBIT && !expense.Description.Contains("Online Transfer to SAV")
        && !expense.Description.Contains("Online Transfer from SAV"))
        .Max(expense => expense.Amount);
    }

     public static decimal GetSecondLargestValue(List<Expenses> list)
    {
        return list.Where(expense => expense.Detail == Detail.DEBIT && !expense.Description.Contains("Online Transfer to SAV")
            && !expense.Description.Contains("Online Transfer from SAV"))
            .OrderByDescending(expense => expense.Amount)
            .Skip(1)
            .FirstOrDefault()?.Amount ?? 0; // If no second largest, return 0
    }

    // New method to get the third largest value
    public static decimal GetThirdLargestValue(List<Expenses> list)
    {
        return list.Where(expense => expense.Detail == Detail.DEBIT && !expense.Description.Contains("Online Transfer to SAV")
            && !expense.Description.Contains("Online Transfer from SAV"))
            .OrderByDescending(expense => expense.Amount)
            .Skip(2)
            .FirstOrDefault()?.Amount ?? 0; // If no third largest, return 0
    }

    public static decimal GetMinValue(List<Expenses> list)
    {
        return list.Where(expense => expense.Detail == Detail.DEBIT).Min(expense => expense.Amount);
    }

    public static string GetDescription(List<Expenses> list, decimal amount)
    {
        var expenses = list.FirstOrDefault(expense => expense.Amount == amount);
        return expenses!.Description;

    }

    public static DateTime GetPostingDate(List<Expenses> list, decimal amount)
    {
        var expense = list.FirstOrDefault(expense => expense.Amount == amount);
        return expense.PostingDate;
    }

    public static decimal GetMonthlyIncome(List<Expenses> list)
    {
        decimal monthlyIncome = 0;

        monthlyIncome = list.Where(expense => expense.Detail == Detail.CREDIT && expense.Type == BudgetApp.Models.Type.ACH_CREDIT.ToString())
        .Sum(expense => expense.Amount);

        return monthlyIncome;
    }

    public static decimal GetCreditCardPayments(List<Expenses> list)
    {
         var total = list.Where(expense => expense.Detail == Detail.DEBIT 
        && (expense.Description.Contains("PAYMENT TO CHASE CARD ENDING" ) 
        || expense.Description.Contains("Payment to Chase card ending")
        || expense.Description.Contains("AMERICAN EXPRESS")
        || expense.Description.Contains("APPLECARD")
        || expense.Description.Contains("CAPITAL ONE")))
        .Sum(expense => expense.Amount);

        return total;
    }


}