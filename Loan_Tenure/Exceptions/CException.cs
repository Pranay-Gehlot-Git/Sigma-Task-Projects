using System.Runtime.Serialization;
namespace Loan_Tenure.Exceptions;
[Serializable]
 public class CException : Exception
    {
        public CException()
        {
        }

        public CException(string message) 
            : base(message)
        {
        }

        public CException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }

        // Without this constructor, deserialization will fail
        protected CException(SerializationInfo info, StreamingContext context) 
            : base(info, context)
        {
        }
    }
