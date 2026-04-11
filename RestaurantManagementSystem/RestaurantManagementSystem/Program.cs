using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using RestaurantManagementSystem.BusinessLayer;
using RestaurantManagementSystem.DataLayer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ================= SERVICES =================

// Add Controllers
builder.Services.AddControllers();

// Dependency Injection
builder.Services.AddScoped<BLRegistration>();
builder.Services.AddScoped<BLLogin>();
builder.Services.AddScoped<BLTableReservation>();
builder.Services.AddScoped<BLPayment>();
builder.Services.AddScoped<SqlServerDB>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT Secret Key
var key = Encoding.UTF8.GetBytes("ThisIsMySuperSecretJwtKeyForRestaurantManagementSystem12345");

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // important for local dev

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// CORS (IMPORTANT FIX)
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", policy =>
    {
        policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ================= MIDDLEWARE =================

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// IMPORTANT: Use HTTP for local to avoid SSL error
// comment HTTPS if causing ERR_SSL_PROTOCOL_ERROR
// app.UseHttpsRedirection();

app.UseCors("MyCorsPolicy");   // MUST be before auth

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();