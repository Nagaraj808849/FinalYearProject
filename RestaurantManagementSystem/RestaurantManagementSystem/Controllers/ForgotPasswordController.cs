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

        public ForgotPasswordController(IConfiguration config, BLRegistration bl)
        {
            _config = config;
            _bl = bl;
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

                // Aggressive placeholder check (Case-Insensitive)
                string emailUpper = (senderEmail ?? "").ToUpper();
                string passUpper = (appPassword ?? "").ToUpper();

                bool isPlaceholder = string.IsNullOrWhiteSpace(senderEmail) || 
                                     emailUpper.Contains("YOUR_GMAIL") || 
                                     passUpper.Contains("YOUR_16_DIGIT") ||
                                     emailUpper.Contains("EXAMPLE.COM");

                Console.WriteLine($"\n[OTP SYSTEM]: Checking Configuration...");
                Console.WriteLine($"[OTP SYSTEM]: Sender: {senderEmail}");
                Console.WriteLine($"[OTP SYSTEM]: Is Developer Mode: {isPlaceholder}\n");

                if (isPlaceholder)
                {
                    // For local development, still log to console
                    Console.WriteLine("\n[DEV MODE]: Credentials not configured. Use the code below:");
                    Console.WriteLine($"OTP: {otpCode} for {request.Email}\n");

                    return Ok(new { 
                        message = "OTP has been successfully generated. (DEVELOPMENT MODE: Check the backend console for the 6-digit code)\n\n" +
                                  "If you do not receive the OTP, please ensure that your email address is correct. " +
                                  "In case of continued issues, the system administrator should verify that SMTP (Gmail) email settings are properly configured.\n\n" +
                                  "Thank you for your patience.",
                        isDevMode = true 
                    });
                }

                // Send Real Email via SMTP
                using (var smtp = new SmtpClient(smtpServer, smtpPort))
                {
                    smtp.EnableSsl = true;
                    smtp.Credentials = new NetworkCredential(senderEmail, appPassword);
                    smtp.Timeout = 10000; // 10s timeout

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(senderEmail, "Golden Essence Restaurant"),
                        Subject = "Your Password Reset OTP",
                        Body = $"Hello,\n\nYour One-Time Password (OTP) for resetting your password is: {otpCode}\n\nThis code is valid for 10 minutes.\n\nThank you,\nGolden Essence Team",
                        IsBodyHtml = false
                    };
                    mailMessage.To.Add(request.Email);

                    smtp.Send(mailMessage);
                    return Ok(new { 
                        message = "OTP has been successfully generated and will be sent to your registered email address.\n\n" +
                                  "If you do not receive the OTP, please ensure that your email address is correct and check your Spam/Junk folder. " +
                                  "In case of continued issues, the system administrator should verify that SMTP (Gmail) email settings are properly configured to enable email delivery.\n\n" +
                                  "Thank you for your patience." 
                    });
                }
            }
            catch (SmtpException smtpEx)
            {
                return StatusCode(500, new { 
                    message = "Gmail SMTP error. Authentication failed or port 587 is blocked.",
                    error = smtpEx.Message 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Failed to send OTP. Unexpected error occurred.",
                    error = ex.Message 
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
