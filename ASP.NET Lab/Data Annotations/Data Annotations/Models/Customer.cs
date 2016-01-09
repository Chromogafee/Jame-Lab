using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace Data_Annotations.Models
{
    public class Customer
    {
        [Required(ErrorMessage = "Your Name is required")]
        [DisplayName("Name")]
        public string Name { get; set; }
        [DisplayName("Tel")]
        public string Tel { get; set; }
        [DisplayName("Email")]
        public string Email { get; set; }
    }
}