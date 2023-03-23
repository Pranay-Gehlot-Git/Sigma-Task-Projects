
namespace CLoan.Exceptions;

public class CException : Exception
{

    public string? Error { get; set; }

    public CException(string Error)
    {
        this.Error = Error;
    }


}