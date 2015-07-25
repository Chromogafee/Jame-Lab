using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace PagedListTest.Models
{
    public class DefaultModel
    {
        public List<Student> StudentList{ get; set; }
        public string keyword { get; set; }
        public DefaultModel()
        {
            StudentList = new JameLabEntities().Student.OrderBy(s=>s.Id).ToList();
        }
    }
}