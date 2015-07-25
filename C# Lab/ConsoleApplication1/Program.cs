using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace DatabaseLab
{
    class Program
    {
        static StudentDatabase studentdb = new StudentDatabase();
        static void Main(string[] args)
        {
            var studentData = studentdb.getStudent();
            var sb = new StringBuilder();
            sb.AppendLine("Id\tName\tAge\tGender");
            foreach (var item in studentData)
            {
                Console.Write(item.Id+" ");
                Console.Write(item.Name+ " ");
                Console.Write(item.Age + " ");
                Console.Write(item.Gender + "\n");
            }
        }
    }
}
