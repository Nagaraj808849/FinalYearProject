using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestaurantManagementSystem.BusinessLayer;
using RestaurantManagementSystem.Models;

namespace RestaurantManagementSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly BLPayment _blPayment;

        public PaymentController()
        {
            _blPayment = new BLPayment();
        }

        
        [HttpPost]
        public IActionResult InsertPayment(PaymentClass payment)
        {
            _blPayment.InsertPayment(payment);
            return Ok("Payment Added Successfully");
        }

       

    }
}
