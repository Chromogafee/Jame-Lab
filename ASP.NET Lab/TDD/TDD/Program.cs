using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TDD.Service;

namespace TDD
{
    class Program
    {
        static void Main(string[] args)
        {
            var math = new MathService();
            var addResult = math.Add(7, 5);
        }
    }
}
