using System;
using BudgetApp.Models;

namespace BudgetApp;

public static class Calculations
{
    public static decimal AddTotal(List<Expenses> totals)
    {
        decimal sum = 0;
        
        // foreach (var transaction in totals)
        // {
        //     sum += transaction.Amount;
        // }
        sum = totals.Where(expense => expense.Detail == "DEBIT").Sum(expense => expense.Amount);
        return Math.Round(sum,2);
    }

    public static decimal GetLargestValue(List<Expenses> list)
    {
        return list.Where(expense => expense.Detail == "DEBIT")
        .Max(expense => expense.Amount);
    }

    public static decimal GetMinValue(List<Expenses> list)
    {
        return list.Where(expense => expense.Detail == "DEBIT").Min(expense => expense.Amount);
    }

    public static string GetDescription(List<Expenses> list, decimal amount)
    {
        var expenses = list.FirstOrDefault(expense => expense.Amount == amount);
        return expenses!.Description;

    }
}