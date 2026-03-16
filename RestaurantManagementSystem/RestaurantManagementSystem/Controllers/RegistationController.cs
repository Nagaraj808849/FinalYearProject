using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManagementSystem.BusinessLayer;
using RestaurantManagementSystem.Models;

namespace RestaurantManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        private readonly BLRegistration _blRegistration;

        public RegistrationController(BLRegistration blRegistration)
        {
            _blRegistration = blRegistration;
        }

        // =============================
        // INSERT USER
        // =============================
        [AllowAnonymous]
        [HttpPost("InsertRegisters")]
        public IActionResult Register([FromBody] RegistrationClass registration)
        {
            try
            {
                if (registration == null)
                {
                    return BadRequest(new { message = "Invalid request data." });
                }

                if (string.IsNullOrWhiteSpace(registration.FirstName) ||
                    string.IsNullOrWhiteSpace(registration.LastName) ||
                    string.IsNullOrWhiteSpace(registration.EmailId) ||
                    string.IsNullOrWhiteSpace(registration.Password))
                {
                    return BadRequest(new { message = "All fields are required." });
                }

                bool result = _blRegistration.RegisterValues(registration);

                if (result)
                {
                    return Ok(new { message = "User Registered Successfully" });
                }

                return BadRequest(new { message = "Registration Failed" });
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


        // =============================
        // GET ALL USERS
        // =============================
        [Authorize(Roles = "1")]
        [HttpGet("GetRegisters")]
        public IActionResult GetRegisters()
        {
            try
            {
                var users = _blRegistration.GetRegisters();

                if (users == null || !users.Any())
                {
                    return NotFound(new { message = "No users found" });
                }

                return Ok(users);
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


        // =============================
        // GET USER BY ID
        // =============================
        [Authorize(Roles = "1")]
        [HttpGet("GetRegisterById/{UserId}")]
        public IActionResult GetRegisterById(int UserId)
        {
            try
            {
                var user = _blRegistration.GetRegisterById(UserId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(user);
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


        // =============================
        // UPDATE USER
        // =============================
        [Authorize]
        [HttpPut("UpdateRegister/{UserId}")]
        public IActionResult UpdateRegister(int UserId, [FromBody] RegistrationClass registration)
        {
            try
            {
                if (registration == null)
                {
                    return BadRequest(new { message = "Invalid data" });
                }

                bool result = _blRegistration.UpdateRegister(UserId, registration);

                if (result)
                {
                    return Ok(new { message = "User Updated Successfully" });
                }

                return BadRequest(new { message = "Update Failed" });
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


        // =============================
        // DELETE USER
        // =============================
        [Authorize(Roles = "1")]
        [HttpDelete("DeleteRegister/{UserId}")]
        public IActionResult DeleteRegister(int UserId)
        {
            try
            {
                bool result = _blRegistration.DeleteRegister(UserId);

                if (result)
                {
                    return Ok(new { message = "User Deleted Successfully" });
                }

                return NotFound(new { message = "User Not Found" });
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