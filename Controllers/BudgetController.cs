using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace BudgetApp.Controllers;

[ApiController]
[Route("[controller]")]
public class BudgetController : ControllerBase
{

    [HttpGet]
    public IActionResult Get()
    {
        return Ok( new { message = "hi"});
    }

    [HttpPost("upload")]
    public IActionResult UploadBudgetData([FromBody] List<List<object>> data)
    {
        if (data == null || !data.Any())
        {
            return BadRequest("No data was provided.");
        }

        // Process the uploaded data (e.g., save to database)
        return Ok(new { message = "Data uploaded successfully.", receivedData = data });
    }


}
