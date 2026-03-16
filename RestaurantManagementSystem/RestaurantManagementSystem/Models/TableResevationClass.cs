namespace RestaurantManagementSystem.Models
{
    public class TableResevationClass
    {
        public int ReservationId { get; set; }

        public string UserName { get; set; }

        public string UserEmail { get; set; }

        public DateTime ReservationDateTime { get; set; }

        public int NoOfPeople { get; set; }

        public string SpecialAttentions { get; set; }
    }
}
