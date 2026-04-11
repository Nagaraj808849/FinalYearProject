using System;
using System.Data;
using Microsoft.Data.SqlClient;
using RestaurantManagementSystem.DataLayer;
using RestaurantManagementSystem.Models;

namespace RestaurantManagementSystem.BusinessLayer
{
    public class BLUserProfile
    {
        private readonly SqlServerDB _db;

        public BLUserProfile(SqlServerDB db)
        {
            _db = db ?? throw new ArgumentNullException(nameof(db));
        }

        // =========================
        // INSERT PROFILE
        // =========================
        public bool InsertProfile(UserProfileClass profile)
        {
            string procedureName = "sp_InsertUserProfile";

            SqlParameter[] parameters =
            {
                new SqlParameter("@UserId", profile.UserId),
                new SqlParameter("@UserName", profile.UserName ?? (object)DBNull.Value),
                new SqlParameter("@Email", profile.Email ?? (object)DBNull.Value),
                new SqlParameter("@ProfileImage", profile.ProfileImage ?? (object)DBNull.Value)
            };

            int result = _db.ExecuteNonQuery(
                procedureName,
                CommandType.StoredProcedure,
                parameters
            );

            return result > 0;
        }

        // =========================
        // UPDATE PROFILE
        // =========================
        public bool UpdateProfile(UserProfileClass profile)
        {
            string procedureName = "sp_UpdateUserProfile";

            SqlParameter[] parameters =
            {
                new SqlParameter("@UserId", profile.UserId),
                new SqlParameter("@UserName", profile.UserName ?? (object)DBNull.Value),
                new SqlParameter("@Email", profile.Email ?? (object)DBNull.Value),
                new SqlParameter("@ProfileImage", profile.ProfileImage ?? (object)DBNull.Value)
            };

            int result = _db.ExecuteNonQuery(
                procedureName,
                CommandType.StoredProcedure,
                parameters
            );

            return result > 0;
        }

        // =========================
        // GET PROFILE BY USERID
        // =========================
        public UserProfileClass GetProfile(int userId)
        {
            string procedureName = "sp_GetUserProfile";

            SqlParameter[] parameters =
            {
                new SqlParameter("@UserId", userId)
            };

            DataTable dt = _db.GetDataTable(
                procedureName,
                CommandType.StoredProcedure,
                parameters
            );

            if (dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0];

                return new UserProfileClass
                {
                    ProfileId = Convert.ToInt32(row["ProfileId"]),
                    UserId = Convert.ToInt32(row["UserId"]),
                    UserName = row["UserName"]?.ToString() ?? string.Empty,
                    Email = row["Email"]?.ToString() ?? string.Empty,
                    ProfileImage = row["ProfileImage"] as byte[],
                    UpdatedDate = row["UpdatedDate"] != DBNull.Value ? Convert.ToDateTime(row["UpdatedDate"]) : DateTime.MinValue
                };
            }

            return null;
        }
    }
}