using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using RestaurantManagementSystem.BusinessLayer;
using RestaurantManagementSystem.Models;

namespace RestaurantManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly BLRegistration _blRegistration;

        private const string JwtKey = "ThisIsMySuperSecretJwtKeyForRestaurantManagementSystem12345";

        public LoginController(BLRegistration blRegistration)
        {
            _blRegistration = blRegistration;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginClass login)
        {
            try
            {
                if (login == null)
                {
                    return BadRequest(new { message = "Invalid login data" });
                }

                var user = _blRegistration.ValidateLogin(login);

                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid Email or Password" });
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, user.EmailId),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim("UserId", user.UserId.ToString())
                };

                var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(2),
                    signingCredentials: creds
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new
                {
                    token = tokenString,
                    userId = user.UserId,
                    email = user.EmailId,
                    role = user.Role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Server Error",
                    error = ex.Message
                });
            }
        }
    }
}