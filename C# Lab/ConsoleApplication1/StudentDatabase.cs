using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseLab
{
    class StudentDatabase
    {
        private JameLabEntities1 _jameContext = new JameLabEntities1();
        public List<Student> getStudent()
        {
            return _jameContext.Student.ToList();
        }
    }
}
