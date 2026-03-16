using System;
using System.Data;
using Microsoft.Data.SqlClient;
using RestaurantManagementSystem.DataLayer;
using RestaurantManagementSystem.Models;
using System.Collections.Generic;

// 🔹 JWT namespaces
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RestaurantManagementSystem.BusinessLayer
{
    public class BLRegistration
    {
        private readonly SqlServerDB _db;

        // 🔹 JWT Secret Key
        private readonly string jwtKey = "ThisIsMySuperSecretJwtKeyForRestaurantManagementSystem12345";

        public BLRegistration(SqlServerDB db)
        {
            _db = db ?? throw new ArgumentNullException(nameof(db));
        }

        // =========================
        // INSERT USER
        // =========================
        public bool RegisterValues(RegistrationClass registration)
        {
            if (registration == null)
                throw new ArgumentNullException(nameof(registration));

            try
            {
                string procedureName = "sp_InsertRegistration";

                SqlParameter[] sqlParameters =
                {
                    new SqlParameter("@FirstName", registration.FirstName ?? (object)DBNull.Value),
                    new SqlParameter("@LastName", registration.LastName ?? (object)DBNull.Value),
                    new SqlParameter("@EmailId", registration.EmailId ?? (object)DBNull.Value),
                    new SqlParameter("@Password", registration.Password ?? (object)DBNull.Value)
                };

                int result = _db.ExecuteNonQuery(
                    procedureName,
                    CommandType.StoredProcedure,
                    sqlParameters
                );

                return result > 0;
            }
            catch (SqlException ex)
            {
                if (ex.Number == 2627 || ex.Number == 2601)
                {
                    throw new Exception("Email already exists.");
                }

                throw;
            }
        }

        // =========================
        // GET ALL USERS
        // =========================
        public List<RegistrationClass> GetRegisters()
        {
            List<RegistrationClass> list = new List<RegistrationClass>();

            string procedureName = "sp_GetRegistrations";

            DataTable dt = _db.GetDataTable(
                procedureName,
                CommandType.StoredProcedure,
                null
            );

            foreach (DataRow row in dt.Rows)
            {
                list.Add(new RegistrationClass
                {
                    UserId = Convert.ToInt32(row["UserId"]),
                    FirstName = row["FirstName"].ToString(),
                    LastName = row["LastName"].ToString(),
                    EmailId = row["EmailId"].ToString(),
                    Password = row["Password"].ToString(),
                    Role = row["Role"] != DBNull.Value ? Convert.ToInt32(row["Role"]) : 0
                });
            }

            return list;
        }

        // =========================
        // GET USER BY ID
        // =========================
        public RegistrationClass GetRegisterById(int userId)
        {
            string procedureName = "sp_GetRegistrationById";

            SqlParameter[] parameters =
            {
                new SqlParameter("@Id", userId),
            };

            DataTable dt = _db.GetDataTable(
                procedureName,
                CommandType.StoredProcedure,
                parameters
            );

            if (dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0];

                return new RegistrationClass
                {
                    UserId = Convert.ToInt32(row["UserId"]),
                    FirstName = row["FirstName"].ToString(),
                    LastName = row["LastName"].ToString(),
                    EmailId = row["EmailId"].ToString(),
                    Password = row["Password"].ToString(),
                    Role = row["Role"] != DBNull.Value ? Convert.ToInt32(row["Role"]) : 0
                };
            }

            return null;
        }

        // =========================
        // UPDATE USER
        // =========================
        public bool UpdateRegister(int userId, RegistrationClass registration)
        {
            string procedureName = "sp_UpdateRegistration";

            SqlParameter[] parameters =
            {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@FirstName", registration.FirstName ?? (object)DBNull.Value),
                new SqlParameter("@LastName", registration.LastName ?? (object)DBNull.Value),
                new SqlParameter("@EmailId", registration.EmailId ?? (object)DBNull.Value),
                new SqlParameter("@Password", registration.Password ?? (object)DBNull.Value)
            };

            int result = _db.ExecuteNonQuery(
                procedureName,
                CommandType.StoredProcedure,
                parameters
            );

            return result > 0;
        }

        // =========================
        // DELETE USER
        // =========================
        public bool DeleteRegister(int userId)
        {
            string procedureName = "sp_DeleteRegistration";

            SqlParameter[] parameters =
            {
                new SqlParameter("@UserId", userId)
            };

            int result = _db.ExecuteNonQuery(
                procedureName,
                CommandType.StoredProcedure,
                parameters
            );

            return result > 0;
        }

        // =========================
        // USER LOGIN
        // =========================
        public RegistrationClass ValidateLogin(LoginClass login)
        {
            if (login == null)
                throw new ArgumentNullException(nameof(login));

            string procedureName = "sp_ValidateLogin";

            SqlParameter[] parameters =
            {
                new SqlParameter("@EmailId", login.EmailId ?? (object)DBNull.Value),
                new SqlParameter("@Password", login.Password ?? (object)DBNull.Value)
            };

            DataTable dt = _db.GetDataTable(
                procedureName,
                CommandType.StoredProcedure,
                parameters
            );

            if (dt != null && dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0];

                return new RegistrationClass
                {
                    UserId = Convert.ToInt32(row["UserId"]),
                    FirstName = row["FirstName"].ToString(),
                    LastName = row["LastName"].ToString(),
                    EmailId = row["EmailId"].ToString(),
                    Role = row["Role"] != DBNull.Value ? Convert.ToInt32(row["Role"]) : 0
                };
            }

            return null;
        }

        // =========================
        // 🔹 JWT TOKEN GENERATOR
        // =========================
        public string GenerateJwtToken(RegistrationClass user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.EmailId),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("UserId", user.UserId.ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}