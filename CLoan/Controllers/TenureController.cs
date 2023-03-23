using Microsoft.AspNetCore.Mvc;
namespace CLoan.Controllers;
using CLoan.Modals;
using CLoan.Exceptions;

[ApiController]
[Route("[controller]")]
public class TenureController : ControllerBase
{

    [HttpGet]
    public IResult GetData([FromQuery] int id)
    {
        try
        {

            // var query = request.Query;
            // LoanData.Validate(query);
            // var res = LoanData.SetData(query);
            return Results.Ok();

        }
        catch (CException err)
        {
            Response res = new Response();
            res.message = "Operation Failed";
            res.Error = err.Error;
            return Results.BadRequest(res);

        }
    }
}
