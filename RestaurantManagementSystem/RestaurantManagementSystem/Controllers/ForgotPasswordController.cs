using Microsoft.AspNetCore.Mvc;
using RestaurantManagementSystem.BusinessLayer;
using RestaurantManagementSystem.DataLayer;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace RestaurantManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForgotPasswordController : ControllerBase
    {
        private readonly BLRegistration _bl;
        private readonly IConfiguration _config;
        
        // In-memory OTP storage: Email -> (Code, Expiry)
        private static readonly Dictionary<string, (string Code, DateTime Expiry)> _otpStore = new();

        public ForgotPasswordController(IConfiguration config)
        {
            _config = config;
            _bl = new BLRegistration(new SqlServerDB());
        }

        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] ForgotPassRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { message = "Email is required" });

            // Check if user exists
            if (!_bl.CheckEmailExists(request.Email))
            {
                return NotFound(new { message = "No account found with this email address. Please register first." });
            }

            // Generate 6-digit OTP
            string otpCode = new Random().Next(100000, 999999).ToString();
            _otpStore[request.Email!] = (otpCode, DateTime.Now.AddMinutes(10));

            try
            {
                var emailSettings = _config.GetSection("EmailSettings");
                string smtpServer = emailSettings["SmtpServer"] ?? "smtp.gmail.com";
                int smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
                string senderEmail = emailSettings["SenderEmail"] ?? "";
                string appPassword = emailSettings["AppPassword"] ?? "";

                bool isPlaceholder = string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(appPassword) || 
                                     senderEmail == "your-gmail@gmail.com" || appPassword == "your-app-password";

                if (isPlaceholder)
                {
                    Console.WriteLine("\n************************************************************");
                    Console.WriteLine($"[DEVELOPMENT MODE - OTP]: {otpCode}");
                    Console.WriteLine($"[TO EMAIL]: {request.Email}");
                    Console.WriteLine("Note: Real email was NOT sent because credentials are placeholders.");
                    Console.WriteLine("************************************************************\n");

                    return Ok(new { 
                        message = "OTP generated (DEVELOPMENT MODE). Check the server terminal/console for the 6-digit code.",
                        isDevMode = true 
                    });
                }

                // Send Email via Gmail SMTP
                var fromAddress = new MailAddress(senderEmail, "Golden Essence Restaurant");
                var toAddress = new MailAddress(request.Email);
                const string subject = "Your Golden Essence Password Reset OTP";
                string body = $"Hello,\n\nYour OTP for password reset is: {otpCode}\n\nThis code expires in 10 minutes.\n\nThank you,\nGolden Essence Restaurant";

                var smtp = new SmtpClient
                {
                    Host = smtpServer,
                    Port = smtpPort,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(senderEmail, appPassword)
                };

                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body
                })
                {
                    // Print to terminal for developer visibility
                    Console.WriteLine($"\n[OTP DEBUG]: Sending {otpCode} to {request.Email}\n");
                    
                    smtp.Send(message);
                    return Ok(new { message = "OTP sent to your email successfully" });
                }
            }
            catch (Exception ex)
            {
                // Detailed ERROR message for UI
                string errorDetail = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { 
                    message = "Gmail SMTP error. Ensure you are using an 'App Password' and port 587 is open.",
                    error = errorDetail 
                });
            }
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            if (_otpStore.TryGetValue(request.Email, out var storedOtp))
            {
                if (storedOtp.Code == request.Otp && storedOtp.Expiry > DateTime.Now)
                {
                    return Ok(new { message = "OTP verified successfully" });
                }
            }
            return BadRequest(new { message = "Invalid or expired OTP" });
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPassRequest request)
        {
            // Re-verify OTP for security (Production best practice)
            if (_otpStore.TryGetValue(request.Email, out var storedOtp))
            {
                if (storedOtp.Code == request.Otp && storedOtp.Expiry > DateTime.Now)
                {
                    bool success = _bl.UpdatePassword(request.Email, request.NewPassword);
                    if (success)
                    {
                        _otpStore.Remove(request.Email); // Clear used OTP
                        return Ok(new { message = "Password updated successfully" });
                    }
                }
            }
            return BadRequest(new { message = "Security verification failed. Please request a new OTP." });
        }
    }

    public class ForgotPassRequest { public string? Email { get; set; } }
    public class VerifyOtpRequest { public string? Email { get; set; } public string? Otp { get; set; } }
    public class ResetPassRequest { public string? Email { get; set; } public string? Otp { get; set; } public string? NewPassword { get; set; } }
}
