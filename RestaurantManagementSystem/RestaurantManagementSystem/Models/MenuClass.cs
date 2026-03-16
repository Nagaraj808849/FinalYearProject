namespace RestaurantManagementSystem.Models
{
    public class MenuClass
    {
        public int menu_id { get; set; }
        public int category_id { get; set; }
        public string item_name { get; set; }
        public string Description { get; set; }
        public int price { get; set; }
        public byte[] image { get; set; }
        public bool is_available { get; set; }
    }
}
