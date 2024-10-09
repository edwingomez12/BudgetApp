using System;

namespace BudgetApp.Calculations;

public static class Calculations
{
    public static decimal AddTotal(List<decimal> totals)
    {
        decimal sum = 0;
        
        foreach (var transaction in totals)
        {
            sum += transaction;
        }
        return Math.Round(sum,2);
    }
}