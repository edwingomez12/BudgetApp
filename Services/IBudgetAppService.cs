using BudgetApp.Models;
namespace BudgetApp;


public interface IBudgetAppService
{
    public BudgetSumaryDto GetTotalMoneySpent(List<Expenses> expenses);
}