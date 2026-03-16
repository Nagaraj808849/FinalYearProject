using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using RestaurantManagementSystem.DataLayer;
using RestaurantManagementSystem.Models;

namespace RestaurantManagementSystem.BusinessLayer
{
    public class BLTableReservation
    {
        private readonly SqlServerDB _db;

        public BLTableReservation(SqlServerDB db)
        {
            _db = db;
        }

        public bool InsertReservation(TableResevationClass reservation)
        {
            string procedureName = "sp_InsertReservation";

            SqlParameter[] parameters =
            {
                new SqlParameter("@UserName", reservation.UserName),
                new SqlParameter("@UserEmail", reservation.UserEmail),
                new SqlParameter("@ReservationDateTime", reservation.ReservationDateTime),
                new SqlParameter("@NoOfPeople", reservation.NoOfPeople),
                new SqlParameter("@SpecialAttentions", reservation.SpecialAttentions ?? (object)DBNull.Value)
            };

            int result = _db.ExecuteNonQuery(
                procedureName,
                CommandType.StoredProcedure,
                parameters
            );

            return result > 0;
        }

        public List<TableResevationClass> GetAllReservations()
        {
            string query = "SELECT * FROM TableResevation"; // Based on typo in Model name, likely table name too
            DataTable dt = _db.GetDataTable(query);

            List<TableResevationClass> reservations = new List<TableResevationClass>();

            foreach (DataRow dr in dt.Rows)
            {
                reservations.Add(new TableResevationClass
                {
                    ReservationId = Convert.ToInt32(dr["ReservationId"]),
                    UserName = dr["UserName"].ToString(),
                    UserEmail = dr["UserEmail"].ToString(),
                    ReservationDateTime = Convert.ToDateTime(dr["ReservationDateTime"]),
                    NoOfPeople = Convert.ToInt32(dr["NoOfPeople"]),
                    SpecialAttentions = dr["SpecialAttentions"].ToString()
                });
            }

            return reservations;
        }
    }
}
