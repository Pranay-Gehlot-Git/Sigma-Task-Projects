using CLoan.Modals;
using CLoan.Exceptions;
public class CalculateTenure
{
    public static Response Calc(LoanData data)
    {
        if (data.interestRate == 0)
        {
            data.loanTenure = (int)Math.Ceiling(data.loanAmount / data.emi);

            data.interestPayable = 0;
            data.totalAmount = data.loanAmount;
        }
        else
        {


            double tenureM = Math.Log(data.emi / (data.emi - (data.loanAmount * (data.interestRate / 1200))), 1 + (data.interestRate / 1200));
            data.loanTenure = (int)Math.Ceiling(tenureM) - 1;

            data.interestPayable = Math.Round((data.emi * data.loanTenure) - data.loanAmount, 2);
            data.totalAmount = data.interestPayable + data.loanAmount;

            if (data.emi > data.totalAmount)
            {
                throw new CException("Emi should be lower Or equal to Total Amount");
            }
        }

        Response response = new Response();

        response.message = "Successully Calculated";
        response.Error = "Null";
        response.data = data;

        return response;


    }

}