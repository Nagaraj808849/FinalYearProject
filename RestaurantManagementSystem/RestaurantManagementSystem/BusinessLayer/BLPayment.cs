using System.Data;
using Microsoft.Data.SqlClient;
using RestaurantManagementSystem.Models;
using RestaurantManagementSystem.DataLayer;

namespace RestaurantManagementSystem.BusinessLayer
{
    public class BLPayment
    {
        private readonly SqlServerDB _db;

        public BLPayment()
        {
            _db = new SqlServerDB();
        }

        public int InsertPayment(PaymentClass payment)
        {
            SqlParameter[] parameters =
            {
                new SqlParameter("@payment_date", payment.payment_date),
                new SqlParameter("@amount", payment.amount),
                new SqlParameter("@method", payment.method)
            };

            return _db.ExecuteNonQuery(
                "sp_InsertPayment",
                CommandType.StoredProcedure,
                parameters
            );
        }
    }
}