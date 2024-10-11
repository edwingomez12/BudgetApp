using BudgetApp.Models;
namespace BudgetApp;


public interface IBudgetAppService
{
    public Dictionary<DateGroup, BudgetSumaryDto> GetTotalMoneySpent(List<Expenses> expenses);
}