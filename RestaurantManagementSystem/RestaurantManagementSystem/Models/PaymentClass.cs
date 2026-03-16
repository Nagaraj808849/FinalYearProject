namespace RestaurantManagementSystem.Models
{
    public class PaymentClass
    {
        public int payment_id { get; set; }
        public int orderid { get; set; }
        public DateTime payment_date { get; set; }
        public int amount { get; set; }
        public string method { get; set; }
    }
}
