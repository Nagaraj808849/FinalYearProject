using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using RestaurantManagementSystem.BusinessLayer;
using RestaurantManagementSystem.DataLayer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers();

// Dependency Injection
builder.Services.AddScoped<BLRegistration>();
builder.Services.AddScoped<BLLogin>();
builder.Services.AddScoped<BLTableReservation>();
builder.Services.AddScoped<BLPayment>();
builder.Services.AddScoped<SqlServerDB>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// JWT Secret Key (Must be 32+ characters)
var key = Encoding.UTF8.GetBytes("ThisIsMySuperSecretJwtKeyForRestaurantManagementSystem12345");


// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});


// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();


// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Middleware
app.UseHttpsRedirection();

app.UseCors("MyCorsPolicy");

app.UseAuthentication();   // JWT Authentication
app.UseAuthorization();

app.MapControllers();

app.Run();