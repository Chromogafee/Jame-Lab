using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Data_Annotations.Models;

namespace Data_Annotations.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View(new Customer());
        }

        [HttpPost]
        public ActionResult Index(Customer customerData)
        {
            if (ModelState.IsValid)
            {
                return View(new Customer());
            }
            return View(customerData);
        }
    }
}