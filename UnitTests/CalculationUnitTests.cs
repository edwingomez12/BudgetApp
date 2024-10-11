using System;
using Xunit;
using BudgetApp;
using BudgetApp.Models;
using FluentAssertions;

public class CalculationTests
{
    [Fact]
    public void CalculateTotalTes()
    {
        //Arrange
        List<Expenses> Totals = new List<Expenses>();
        Totals.Add(new Expenses() {
            Amount = 123.24m,
            Detail = Detail.DEBIT
        });
        Totals.Add(new Expenses()
        {
            Amount = 234.2m,
            Detail = Detail.DEBIT
        });
        Totals.Add(new Expenses()
        {
            Amount = 48,
            Detail = Detail.DEBIT
        });

        decimal expected = 405.44m;
        //Act
        var total = Calculations.AddTotal(Totals);

        //Assert
        total.Should().Be(expected);
    }
}