using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestaurantManagementSystem.Models;
using RestaurantManagementSystem.BusinessLayer;

namespace RestaurantManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly BLOrderDetails _blOrder;

        public OrderDetailsController()
        {
            _blOrder = new BLOrderDetails();
        }

        // POST: api/OrderDetails
        [HttpPost]
        public IActionResult InsertOrder(OrderDetailsClass order)
        {
            try
            {
                var result = _blOrder.InsertOrder(order);

                if (result > 0)
                {
                    return Ok(new { message = "Order placed successfully" });
                }

                return BadRequest(new { message = "Order failed" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}