using System;
using System.Data;
using Microsoft.Data.SqlClient;
using RestaurantManagementSystem.DataLayer;
using RestaurantManagementSystem.Models;

namespace RestaurantManagementSystem.BusinessLayer
{
    public class BLLogin
    {
        private readonly SqlServerDB _db;

        public BLLogin(SqlServerDB db)
        {
            _db = db;
        }

        public RegistrationClass ValidateLogin(LoginClass login)
        {
            try
            {
                string procedureName = "sp_ValidateLogin";

                SqlParameter[] sqlParameters =
                {
                    new SqlParameter("@EmailId", login.EmailId),
                    new SqlParameter("@Password", login.Password)
                };

                // Execute Stored Procedure
                DataTable dt = _db.GetDataTable(
                    procedureName,
                    CommandType.StoredProcedure,
                    sqlParameters
                );

                if (dt != null && dt.Rows.Count > 0)
                {
                    DataRow row = dt.Rows[0];

                    return new RegistrationClass
                    {
                        FirstName = row["FirstName"]?.ToString(),
                        LastName = row["LastName"]?.ToString(),
                        EmailId = row["EmailId"]?.ToString()
                    };
                }

                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}