using System;
using Xunit;
using BudgetApp.Calculations;

public class CalculationTests
{
    [Fact]
    public void CalculateTotalTes()
    {
        //Arrange
        List<decimal> Totals = new List<decimal>();
        Totals.Add(299.34m);
        Totals.Add(345.2m);
        Totals.Add(124.00m);
        decimal expected = 768.54m;
        //Act
        var total = Calculations.AddTotal(Totals);

        //Assert
        Assert.Equal(expected,total);
    }
}