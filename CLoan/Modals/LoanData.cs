
namespace CLoan.Modals;
using CLoan.Exceptions;
public class LoanData
{


    public double loanAmount { get; set; }

    public double emi { get; set; }

    public string? emiFrequency { get; set; }

    public double interestRate { get; set; }

    public int loanTenure { get; set; }

    public double interestPayable { get; set; }

    public double totalAmount { get; set; }


    public static Response SetData(IQueryCollection query)
    {

        LoanData data = new LoanData();
        data.loanAmount = Convert.ToDouble(query["loanAmount"]);
        data.emi = Convert.ToDouble(query["emi"]);
        data.emiFrequency = Convert.ToString(query["emiFrequency"]);
        data.interestRate = Convert.ToDouble(query["interestRate"]);
        var result = CalculateTenure.Calc(data);
        return result;

    }


    public static void Validate(IQueryCollection query)
    {

        if (!query.ContainsKey("loanAmount") || !query.ContainsKey("emi") || !query.ContainsKey("emiFrequency") || !query.ContainsKey("interestRate")) throw new CException("Invaid Paramenters Passed Should Contain loanAmount, emi, emiFrequency, interestRate");

        if (Convert.ToString(query["loanAmount"]) == "" && Convert.ToString(query["emi"]) == "" && Convert.ToString(query["emiFrequency"]) == "" && Convert.ToString(query["interestRate"]) == "")
        {
            throw new CException("All Data Is Invalid");
        }


        if (Convert.ToString(query["loanAmount"]) == "" || !double.TryParse(query["loanAmount"], out double amount) || Convert.ToDouble(query["loanAmount"]) <= 0)
        {
            throw new CException(" LoanAmount is Invalid should be positive integer Example : 10000, 20000, 2000 ");

        }

        if (Convert.ToString(query["emi"]) == "" || !double.TryParse(query["emi"], out double emii) || Convert.ToDouble(query["emi"]) <= 0)
        {
            throw new CException(" Emi is Invalid should be positive integer Example : 10000, 20000, 2000 ");

        }

        if (Convert.ToString(query["emiFrequency"]) == "" || (Convert.ToString(query["emiFrequency"]) != "Monthly" && Convert.ToString(query["emiFrequency"]) != "Weekly" && Convert.ToString(query["emiFrequency"]) != "Bi-Weekly" && Convert.ToString(query["emiFrequency"]) != "Daily" && Convert.ToString(query["emiFrequency"]) != "Yearly"))
        {

            throw new CException(" emiFrequency is Invalid should use : Monthly, Yearly, Weekly, Bi-Weekly or Daily ");

        }

        if (Convert.ToString(query["interestRate"]) == "" || !double.TryParse(query["interestRate"], out double rate) || Convert.ToDouble(query["interestRate"]) < 0)
        {

            throw new CException(" interestRate is Invalid should use : 10%, 20%");

        }

    }

}