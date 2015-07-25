using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList;
using PagedList.Mvc;
using PagedListTest.Models;

namespace PagedListTest.Controllers
{
    public class DefaultController : Controller
    {
        // GET: Default
        public ActionResult Index(DefaultModel d,int page = 1)
        {
            ViewBag.StudentList = new DefaultModel().StudentList.ToPagedList(page, 3);
            return View(d);
        }
    }
}