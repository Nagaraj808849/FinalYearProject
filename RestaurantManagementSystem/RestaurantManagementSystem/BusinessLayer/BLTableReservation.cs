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

            // Auto-create table if not exists
            try
            {
                _db.ExecuteOnlyQuery(@"
                    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TableResevation')
                    BEGIN
                        CREATE TABLE TableResevation (
                            ReservationId INT IDENTITY(1,1) PRIMARY KEY,
                            UserId INT NULL,
                            UserName NVARCHAR(100) NOT NULL,
                            UserEmail NVARCHAR(100) NOT NULL,
                            ReservationDateTime DATETIME NOT NULL,
                            NoOfPeople INT NOT NULL,
                            SpecialAttentions NVARCHAR(MAX) NULL
                        );
                    END
                ");

                _db.ExecuteOnlyQuery(@"
                    IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_InsertReservation')
                    BEGIN
                        EXEC ('
                        CREATE PROCEDURE sp_InsertReservation
                            @UserName NVARCHAR(100),
                            @UserEmail NVARCHAR(100),
                            @ReservationDateTime DATETIME,
                            @NoOfPeople INT,
                            @SpecialAttentions NVARCHAR(MAX) = NULL,
                            @UserId INT = NULL
                        AS
                        BEGIN
                            INSERT INTO TableResevation (UserName, UserEmail, ReservationDateTime, NoOfPeople, SpecialAttentions, UserId)
                            VALUES (@UserName, @UserEmail, @ReservationDateTime, @NoOfPeople, @SpecialAttentions, @UserId);
                        END
                        ');
                    END
                ");
            } 
            catch { }
        }

        public bool InsertReservation(TableResevationClass reservation)
        {
            string procedureName = "sp_InsertReservation";

            SqlParameter[] parameters =
            {
                new SqlParameter("@UserName", reservation.UserName ?? (object)DBNull.Value),
                new SqlParameter("@UserEmail", reservation.UserEmail ?? (object)DBNull.Value),
                new SqlParameter("@ReservationDateTime", reservation.ReservationDateTime),
                new SqlParameter("@NoOfPeople", reservation.NoOfPeople),
                new SqlParameter("@SpecialAttentions", reservation.SpecialAttentions ?? (object)DBNull.Value),
                new SqlParameter("@UserId", reservation.UserId ?? (object)DBNull.Value)
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
                    UserId = dr["UserId"] != DBNull.Value ? Convert.ToInt32(dr["UserId"]) : (int?)null,
                    UserName = dr["UserName"]?.ToString() ?? string.Empty,
                    UserEmail = dr["UserEmail"]?.ToString() ?? string.Empty,
                    ReservationDateTime = Convert.ToDateTime(dr["ReservationDateTime"]),
                    NoOfPeople = Convert.ToInt32(dr["NoOfPeople"]),
                    SpecialAttentions = dr["SpecialAttentions"]?.ToString() ?? string.Empty
                });
            }

            return reservations;
        }
    }
}
