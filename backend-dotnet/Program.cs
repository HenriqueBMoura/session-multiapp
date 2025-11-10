using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Auth por cookie (dev: SameSite=Lax + sem HTTPS)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(opt =>
    {
        opt.Cookie.Name = ".session.demo";
        opt.Cookie.HttpOnly = true;
        opt.Cookie.SameSite = SameSiteMode.Lax;
        opt.Cookie.SecurePolicy = CookieSecurePolicy.None;
        opt.SlidingExpiration = true;
        opt.ExpireTimeSpan = TimeSpan.FromHours(4);
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:4200",
                "http://localhost:4201"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Login "user" (Next.js)
app.MapPost("/login", async (HttpContext ctx) =>
{
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, "user-123"),
        new Claim(ClaimTypes.Name, "Henrique"),
        new Claim("role", "user")
    };

    var principal = new ClaimsPrincipal(
        new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)
    );

    await ctx.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

    return Results.Ok(new { ok = true });
});

// Login "admin" (Angular2)
app.MapPost("/admin/login", async (HttpContext ctx) =>
{
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, "admin-001"),
        new Claim(ClaimTypes.Name, "Admin Ana"),
        new Claim("role", "admin")
    };

    var principal = new ClaimsPrincipal(
        new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)
    );

    await ctx.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

    return Results.Ok(new { ok = true });
});

app.MapGet("/me", (ClaimsPrincipal user) =>
{
    if (user?.Identity is null || !user.Identity.IsAuthenticated)
        return Results.Unauthorized();

    return Results.Ok(new
    {
        name = user.Identity.Name,
        role = user.FindFirst("role")?.Value
    });
});

app.MapPost("/logout", async (HttpContext ctx) =>
{
    await ctx.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.Ok(new { ok = true });
});

app.Run();