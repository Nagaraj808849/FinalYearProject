using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManagementSystem.BusinessLayer;
using RestaurantManagementSystem.Models;
using Microsoft.AspNetCore.Http; // Added by instruction

namespace RestaurantManagementSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly BLUserProfile _blUserProfile;

        public ProfileController(BLUserProfile blUserProfile)
        {
            _blUserProfile = blUserProfile;
        }

        // =============================
        // INSERT PROFILE
        // =============================
        [HttpPost("InsertProfile")]
        public IActionResult InsertProfile([FromBody] UserProfileClass profile)
        {
            try
            {
                if (profile == null)
                {
                    return BadRequest(new { message = "Invalid profile data" });
                }

                bool result = _blUserProfile.InsertProfile(profile);

                if (result)
                {
                    return Ok(new { message = "Profile created successfully" });
                }

                return BadRequest(new { message = "Profile creation failed" });
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
        // UPDATE PROFILE
        // =============================
        [HttpPut("UpdateProfile")]
        public IActionResult UpdateProfile([FromForm] UserProfileClass profile)
        {
            try
            {
                if (profile == null)
                {
                    return BadRequest(new { message = "Invalid profile data" });
                }

                bool result = _blUserProfile.UpdateProfile(profile);

                if (result)
                {
                    return Ok(new { message = "Profile updated successfully" });
                }

                return BadRequest(new { message = "Profile update failed" });
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
        // GET PROFILE BY USERID
        // =============================
        [HttpGet("GetProfile/{userId}")]
        public IActionResult GetProfile(int userId)
        {
            try
            {
                var profile = _blUserProfile.GetProfile(userId);

                if (profile == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }

                return Ok(profile);
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