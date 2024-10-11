using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace BudgetApp.Models;

public class Expenses
{
    public Detail Detail { get; set; }
    public DateTime PostingDate { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }

    public string Type { get; set; }

    public decimal Balance { get; set; }

}