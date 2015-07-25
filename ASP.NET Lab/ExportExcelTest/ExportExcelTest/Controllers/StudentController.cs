using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace ExportExcelTest.Controllers
{
    public class StudentController : Controller
    {
        public ActionResult Index()
        {
            return View("Student");
        }
        // GET: Student
        public void Indexs()
        {
            JameLabEntities jameLabEntites = new JameLabEntities();
            var studentList=jameLabEntites.Student.ToList();
            var sb = new StringBuilder();
            sb.AppendLine("Id,Name,Age,Gender");
            foreach (var item in studentList)
            {
                sb.AppendFormat("{0},{1},{2},{3}", item.Id, item.Name, item.Age, item.Gender);
                sb.AppendLine();
            }

            Response.BufferOutput = true;
            Response.Clear();
            Response.ClearHeaders();
            Response.ContentEncoding = Encoding.Unicode;
            Response.AppendHeader("Content-Disposition", "attachment; filename=Test.csv");
            Response.ContentType = "text/csv";
            Response.Write(sb.ToString());
        }
    }
}