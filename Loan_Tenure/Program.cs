using Loan_Tenure.Modals;
using Loan_Tenure.Exceptions;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle


var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapGet("/loantenure", (HttpRequest request) =>
{
    try
    {

        var query = request.Query;
        LoanData.Validate(query);
        var res = LoanData.SetData(query);
        return Results.Ok(res);

    }
    catch (CException err)
    {
        Response res = new Response();
        res.message = "Operation Failed";
        res.Error = err.Message;
        return Results.BadRequest(res);

    }
});


app.Run();
