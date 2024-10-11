using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using BudgetApp.Models;

namespace BudgetApp.Controllers;

[ApiController]
[Route("[controller]")]
public class BudgetController : ControllerBase
{
    IBudgetAppService _budgetAppService;

    public BudgetController(IBudgetAppService budgetAppService)
    {
        _budgetAppService = budgetAppService;
    }
    [HttpGet]
    public IActionResult Get()
    {
        return Ok( new { message = "hi"});
    }

    [HttpPost("upload")]
    public IActionResult UploadBudgetData([FromBody] List<Expenses> data)
    {
        if (data == null || !data.Any())
        {
            return BadRequest("No data was provided.");
        }
        var response = _budgetAppService.GetTotalMoneySpent(data);

        var formattedResponse = response.ToDictionary(
        key => $"{key.Key.Year}-{key.Key.Month:00}", // Format year-month as string
        value => value.Value
    );
        // Process the uploaded data (e.g., save to database)
        return Ok(new 
        {
             message = "Data uploaded successfully.", 
             summary = formattedResponse 
        });
    }


}
