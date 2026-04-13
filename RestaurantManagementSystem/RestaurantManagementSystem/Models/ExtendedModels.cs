using System;
using System.Collections.Generic;

namespace RestaurantManagementSystem.Models
{
    public class UserFullIdentity
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? EmailId { get; set; }
        public int Role { get; set; }
        public string? ProfileUserName { get; set; }
        public byte[]? ProfileImage { get; set; }
        public DateTime ProfileUpdatedDate { get; set; }
    }

    public class OrderWithUser
    {
        public string? OrderId { get; set; }
        public string? UserEmail { get; set; }
        public string? UserFullName { get; set; }
        public string? Items { get; set; }
        public decimal TotalAmount { get; set; }
        public string? OrderDate { get; set; }
        public string? Status { get; set; }
    }
}
