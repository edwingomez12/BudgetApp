// using System.Collections.Generic;
// using System.Net;
// using System.Net.Http;
// using System.Text;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Mvc.Testing;
// using Newtonsoft.Json;
// using Xunit;
// using FluentAssertions;

// namespace BudgetApp.Tests
// {
//     public class BudgetControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
//     {
//         private readonly HttpClient _client;

//         public BudgetControllerIntegrationTests(WebApplicationFactory<Program> factory)
//         {
//             // Create a client to interact with the test server
//             _client = factory.CreateClient();
//         }

//         [Fact]
//         public async Task Get_ReturnsOkResponse_WithExpectedMessage()
//         {
//             // Act
//             var response = await _client.GetAsync("/budget");

//             // Assert
//             response.StatusCode.Should().Be(HttpStatusCode.OK);

//             var jsonResponse = await response.Content.ReadAsStringAsync();
//             jsonResponse.Should().Contain("hi");
//         }

//         [Fact]
//         public async Task Post_UploadBudgetData_ReturnsOkResponse_WithUploadedData()
//         {
//             // Arrange
//             var budgetData = new List<List<object>>
//             {
//                 new List<object> { "Item1", 100 },
//                 new List<object> { "Item2", 200 }
//             };

//             var content = new StringContent(JsonConvert.SerializeObject(budgetData), Encoding.UTF8, "application/json");

//             // Act
//             var response = await _client.PostAsync("/budget/upload", content);

//             // Assert
//             response.StatusCode.Should().Be(HttpStatusCode.OK);

//             var jsonResponse = await response.Content.ReadAsStringAsync();
//             jsonResponse.Should().Contain("Data uploaded successfully");
//             jsonResponse.Should().Contain("Item1");
//             jsonResponse.Should().Contain("100");
//         }

//         [Fact]
//         public async Task Post_UploadBudgetData_ReturnsBadRequest_WhenDataIsNull()
//         {
//             // Arrange
//             var content = new StringContent("", Encoding.UTF8, "application/json");

//             // Act
//             var response = await _client.PostAsync("/budget/upload", content);

//             // Assert
//             response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
//             var jsonResponse = await response.Content.ReadAsStringAsync();
//             jsonResponse.Should().Contain("No data was provided");
//         }
//     }
// }
