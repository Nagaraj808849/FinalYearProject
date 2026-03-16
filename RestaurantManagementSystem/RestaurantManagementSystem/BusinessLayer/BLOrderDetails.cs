using System.Data;
using Microsoft.Data.SqlClient;
using RestaurantManagementSystem.Models;
using RestaurantManagementSystem.DataLayer;

namespace RestaurantManagementSystem.BusinessLayer
{
    public class BLOrderDetails
    {
        private readonly SqlServerDB _db;

        public BLOrderDetails()
        {
            _db = new SqlServerDB();
        }

        public int InsertOrder(OrderDetailsClass order)
        {
            SqlParameter[] parameters =
            {
                new SqlParameter("@UserId", order.UserId),
                new SqlParameter("@MenuId", order.MenuId),
                new SqlParameter("@OrderItemId", order.OrderItemId),
                new SqlParameter("@OrderDate", order.OrderDate),
                new SqlParameter("@Quantity", order.Quantity),
                new SqlParameter("@Price", order.Price),
                new SqlParameter("@Total", order.Total)
            };

            return _db.ExecuteNonQuery(
                "sp_InsertOrder",
                CommandType.StoredProcedure,
                parameters
            );
        }
    }
}