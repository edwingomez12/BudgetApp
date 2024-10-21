public class BudgetSumaryDto
{
    public decimal TotalMoneySpent { get; set; }
    public decimal LowestTransactionSpent { get; set; }
    public decimal HighestTransactionSpent { get; set; }

    public decimal SecondHighestTransaction { get; set; }

    public decimal ThirdHighestTransaction { get; set; }

    public string HighestDescription { get; set; }

    public string SecondHighestDescription { get; set; }

    public string ThirdHighestDescription { get; set; }
    public string LowestDescription { get; set; }

    public DateTime HighestPostingDate { get; set; }
    public DateTime LowestPostingDate { get; set; }

    public decimal MonthlyIncome { get; set; }
    public string year { get; set; }

    public string month { get; set; }

    public decimal CreditCardTotal {get; set;}


}