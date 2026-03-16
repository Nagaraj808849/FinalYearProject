namespace RestaurantManagementSystem.Models
{
    public class OrderDetailsClass
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public int MenuId { get; set; }
        public int OrderItemId { get; set; }
        public DateTime OrderDate { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
    }
}
