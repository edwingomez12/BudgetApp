using Xunit;
using BudgetApp.Models;
using FluentAssertions;

namespace BudgetApp.Tests
{
    public class BudgetAppServiceTests
    {
        //[Fact]
        public void GetTotalMoneySpent_ShouldReturnTotalMoneySpent()
        {
            // Arrange
            var service = new BudgetAppService();
            BudgetSumaryDto expected = new BudgetSumaryDto();
            expected.TotalMoneySpent = 354.43m;
            expected.HighestTransactionSpent = 234.2m;
            expected.LowestTransactionSpent = 120.23m;
            List<Expenses> expenses = new List<Expenses>();
            Expenses input1 = new Expenses()
            {
                Description = "uber",
                Detail = Detail.DEBIT,
                Amount = 234.2m,
            };
            Expenses input2 = new Expenses()
            {
                Description = "heb",
                Detail = Detail.DEBIT,
                Amount = 120.23m,
            };
            expenses.Add(input1);
            expenses.Add(input2);

            // Act
            var result = service.GetTotalMoneySpent(expenses);

            // Assert
            //result.HighestTransactionSpent.Should().Be(expected.HighestTransactionSpent);
            //esult.LowestTransactionSpent.Should().Be(expected.LowestTransactionSpent);
            //result.TotalMoneySpent.Should().Be(expected.TotalMoneySpent);
        }
    }
}
