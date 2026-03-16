using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManagementSystem.BusinessLayer;
using RestaurantManagementSystem.Models;

[ApiController]
[Route("api/Menu")]
public class MenuController : ControllerBase
{
    private readonly BLMenu _blMenu;

    public MenuController(IConfiguration configuration)
    {
        _blMenu = new BLMenu(configuration);
    }

    [AllowAnonymous]
    [HttpGet]
    public IActionResult GetMenu()
    {
        return Ok(_blMenu.GetMenu());
    }

    [Authorize(Roles = "1")]
    [HttpPost("AddMenuItem")]
    public IActionResult AddMenuItem([FromBody] MenuClass menu)
    {
        var result = _blMenu.AddMenuItem(menu);

        return Ok(result);
    }

    [Authorize(Roles = "1")]
    [HttpDelete("DeleteMenuItem/{id}")]
    public IActionResult DeleteMenuItem(int id)
    {
        bool result = _blMenu.DeleteMenuItem(id);

        if (result)
            return Ok("Deleted");

        return BadRequest();
    }

    [HttpGet("tables")]
    public IActionResult GetTables()
    {
        return Ok(new RestaurantManagementSystem.DataLayer.SqlServerDB().GetDataTable("SELECT name FROM sys.tables"));
    }
}
