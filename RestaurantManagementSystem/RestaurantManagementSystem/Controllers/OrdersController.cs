using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using RestaurantManagementSystem.DataLayer;
using RestaurantManagementSystem.Models;
using System.Data;

namespace RestaurantManagementSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly SqlServerDB _db;

        public OrdersController()
        {
            _db = new SqlServerDB();
            
            // Auto-create table if not exists
            try
            {
                _db.ExecuteOnlyQuery(@"
                    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserOrders' and xtype='U')
                    CREATE TABLE UserOrders (
                        Id NVARCHAR(50) PRIMARY KEY,
                        UserEmail NVARCHAR(100),
                        Items NVARCHAR(MAX),
                        TotalAmount DECIMAL(18,2),
                        OrderDate NVARCHAR(50),
                        Status NVARCHAR(50)
                    )");
            } catch { } // Ignore if already created
        }

        [HttpPost("CreateOrder")]
        public IActionResult CreateOrder([FromBody] UserOrder order)
        {
            string query = @"
                INSERT INTO UserOrders (Id, UserEmail, Items, TotalAmount, OrderDate, Status)
                VALUES (@Id, @UserEmail, @Items, @TotalAmount, @OrderDate, 'Pending')";
            
            SqlParameter[] parameters = {
                new SqlParameter("@Id", order.Id),
                new SqlParameter("@UserEmail", order.UserEmail),
                new SqlParameter("@Items", order.Items),
                new SqlParameter("@TotalAmount", order.TotalAmount),
                new SqlParameter("@OrderDate", order.OrderDate)
            };

            int result = _db.ExecuteNonQuery(query, CommandType.Text, parameters);
            return Ok(new { message = "Order Created" });
        }

        [HttpGet("GetOrders/{email}")]
        public IActionResult GetOrders(string email)
        {
            string query = "SELECT * FROM UserOrders WHERE UserEmail = @Email ORDER BY OrderDate DESC";
            SqlParameter[] parameters = { new SqlParameter("@Email", email) };
            DataTable dt = _db.GetDataTable(query, CommandType.Text, parameters);

            var orders = new List<UserOrder>();
            foreach (DataRow row in dt.Rows)
            {
                orders.Add(new UserOrder
                {
                    Id = row["Id"].ToString(),
                    UserEmail = row["UserEmail"].ToString(),
                    Items = row["Items"].ToString(),
                    TotalAmount = Convert.ToDecimal(row["TotalAmount"]),
                    OrderDate = row["OrderDate"].ToString(),
                    Status = row["Status"].ToString()
                });
            }
            return Ok(orders);
        }

        [Authorize(Roles = "1")]
        [HttpGet("GetAllOrders")]
        public IActionResult GetAllOrders()
        {
            string query = "SELECT * FROM UserOrders ORDER BY OrderDate DESC";
            DataTable dt = _db.GetDataTable(query);

            var orders = new List<UserOrder>();
            foreach (DataRow row in dt.Rows)
            {
                orders.Add(new UserOrder
                {
                    Id = row["Id"].ToString(),
                    UserEmail = row["UserEmail"].ToString(),
                    Items = row["Items"].ToString(),
                    TotalAmount = Convert.ToDecimal(row["TotalAmount"]),
                    OrderDate = row["OrderDate"].ToString(),
                    Status = row["Status"].ToString()
                });
            }
            return Ok(orders);
        }
        
        [Authorize(Roles = "1")]
        [HttpPut("UpdateStatus")]
        public IActionResult UpdateStatus([FromBody] OrderStatusUpdate update)
        {
            string query = "UPDATE UserOrders SET Status = @Status WHERE Id = @Id";
            SqlParameter[] parameters = {
                new SqlParameter("@Status", update.Status),
                new SqlParameter("@Id", update.Id)
            };
            _db.ExecuteNonQuery(query, CommandType.Text, parameters);
            return Ok(new { message = "Status Updated" });
        }

        [HttpGet("GetTotalExpense/{email}")]
        public IActionResult GetTotalExpense(string email)
        {
            string query = "SELECT SUM(TotalAmount) as Total FROM UserOrders WHERE UserEmail = @Email AND Status != 'Cancelled'";
            SqlParameter[] parameters = { new SqlParameter("@Email", email) };
            DataTable dt = _db.GetDataTable(query, CommandType.Text, parameters);

            decimal total = 0;
            if (dt.Rows.Count > 0 && dt.Rows[0]["Total"] != DBNull.Value)
            {
                total = Convert.ToDecimal(dt.Rows[0]["Total"]);
            }
            return Ok(new { totalExpense = total });
        }

        // =========================
        // JOIN EXAMPLE: Orders + Users
        // =========================
        [Authorize(Roles = "1")]
        [HttpGet("GetAllOrdersWithUsers")]
        public IActionResult GetAllOrdersWithUsers()
        {
            // JOIN: Linking UserOrders and Registration to get names
            string query = @"
                SELECT o.*, (r.FirstName + ' ' + r.LastName) as FullName
                FROM UserOrders o
                INNER JOIN Registration r ON o.UserEmail = r.EmailId
                ORDER BY o.OrderDate DESC";

            DataTable dt = _db.GetDataTable(query);

            var orders = new List<RestaurantManagementSystem.Models.OrderWithUser>();
            foreach (DataRow row in dt.Rows)
            {
                orders.Add(new RestaurantManagementSystem.Models.OrderWithUser
                {
                    OrderId = row["Id"].ToString(),
                    UserEmail = row["UserEmail"].ToString(),
                    UserFullName = row["FullName"].ToString(),
                    Items = row["Items"].ToString(),
                    TotalAmount = Convert.ToDecimal(row["TotalAmount"]),
                    OrderDate = row["OrderDate"].ToString(),
                    Status = row["Status"].ToString()
                });
            }
            return Ok(orders);
        }
    }

    public class UserOrder
    {
        public string? Id { get; set; }
        public string? UserEmail { get; set; }
        public string? Items { get; set; }
        public decimal TotalAmount { get; set; }
        public string? OrderDate { get; set; }
        public string? Status { get; set; }
    }

    public class OrderStatusUpdate
    {
        public string? Id { get; set; }
        public string? Status { get; set; }
    }
}
