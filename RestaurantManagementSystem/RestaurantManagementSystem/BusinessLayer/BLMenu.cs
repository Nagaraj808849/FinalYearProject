using Microsoft.Data.SqlClient;
using RestaurantManagementSystem.Models;
using System.Data;

namespace RestaurantManagementSystem.BusinessLayer
{
    public class BLMenu
    {
        private readonly string connectionString;

        public BLMenu(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // GET MENU
        public List<object> GetMenu()
        {
            List<object> menuList = new List<object>();

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM MenuNew";

                SqlCommand cmd = new SqlCommand(query, con);

                con.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    byte[] img = reader["image"] as byte[];

                    string base64 = null;

                    if (img != null)
                        base64 = Convert.ToBase64String(img);

                    menuList.Add(new
                    {
                        menu_id = reader["menu_id"],
                        category_id = reader["category_id"],
                        item_name = reader["item_name"],
                        Description = reader["Description"],
                        price = reader["price"],
                        image = base64,
                        is_available = reader["is_available"]
                    });
                }
            }

            return menuList;
        }

        // ADD MENU
        public string AddMenuItem(MenuClass menu)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = @"INSERT INTO MenuNew
                (category_id,item_name,Description,price,image,is_available)
                VALUES
                (@cid,@name,@desc,@price,@img,@avail)";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@cid", menu.category_id);
                cmd.Parameters.AddWithValue("@name", menu.item_name);
                cmd.Parameters.AddWithValue("@desc", menu.Description);
                cmd.Parameters.AddWithValue("@price", menu.price);
                cmd.Parameters.AddWithValue("@img", menu.image);
                cmd.Parameters.AddWithValue("@avail", menu.is_available);

                con.Open();

                cmd.ExecuteNonQuery();
            }

            return "Menu Added";
        }

        // DELETE MENU
        public bool DeleteMenuItem(int id)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "DELETE FROM MenuNew WHERE menu_id=@id";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@id", id);

                con.Open();

                int rows = cmd.ExecuteNonQuery();

                return rows > 0;
            }
        }
    }
}