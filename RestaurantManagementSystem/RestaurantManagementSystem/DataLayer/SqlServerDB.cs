using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace RestaurantManagementSystem.DataLayer
{
    public class SqlServerDB
    {
        private readonly string conn;

        public SqlServerDB()
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            conn = configuration.GetConnectionString("DefaultConnection")
                   ?? throw new Exception("Connection string not found");
        }

        // Execute SELECT Query
        public DataTable GetDataTable(string query)
        {
            DataTable table = new DataTable();

            using (SqlConnection sqlConn = new SqlConnection(conn))
            using (SqlCommand cmd = new SqlCommand(query, sqlConn))
            {
                cmd.CommandType = CommandType.Text;

                sqlConn.Open();

                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    da.Fill(table);
                }
            }

            return table;
        }

        // Execute INSERT / UPDATE / DELETE Query
        public int ExecuteOnlyQuery(string query)
        {
            int result;

            using (SqlConnection sqlConn = new SqlConnection(conn))
            using (SqlCommand cmd = new SqlCommand(query, sqlConn))
            {
                cmd.CommandType = CommandType.Text;

                sqlConn.Open();
                result = cmd.ExecuteNonQuery();
            }

            return result;
        }

        // Execute Stored Procedure (SELECT)
        public DataTable GetDataTable(string procedureName, CommandType commandType, params SqlParameter[] parameters)
        {
            DataTable table = new DataTable();

            using (SqlConnection sqlConn = new SqlConnection(conn))
            using (SqlCommand cmd = new SqlCommand(procedureName, sqlConn))
            {
                cmd.CommandType = commandType;

                if (parameters != null && parameters.Length > 0)
                    cmd.Parameters.AddRange(parameters);

                sqlConn.Open();

                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    da.Fill(table);
                }
            }

            return table;
        }

        // Execute Stored Procedure (INSERT / UPDATE / DELETE)
        public int ExecuteNonQuery(string procedureName, CommandType commandType, params SqlParameter[] parameters)
        {
            int result;

            using (SqlConnection sqlConn = new SqlConnection(conn))
            using (SqlCommand cmd = new SqlCommand(procedureName, sqlConn))
            {
                cmd.CommandType = commandType;

                if (parameters != null && parameters.Length > 0)
                    cmd.Parameters.AddRange(parameters);

                sqlConn.Open();
                result = cmd.ExecuteNonQuery();
            }

            return result;
        }
    }
}