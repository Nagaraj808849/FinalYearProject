using System;

namespace RestaurantManagementSystem.Models
{
    public class UserProfileClass
    {
        public int ProfileId { get; set; }

        public int UserId { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public byte[] ProfileImage { get; set; }

        public DateTime UpdatedDate { get; set; }
    }
}