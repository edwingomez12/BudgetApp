public class BudgetSumaryDto
{
    public decimal TotalMoneySpent { get; set; }
    public decimal LowestTransactionSpent { get; set; }
    public decimal HighestTransactionSpent { get; set; }

    public string HighestDescription { get; set; }
    public string LowestDescription { get; set; }

}