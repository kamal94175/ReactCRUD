using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Data.Entity;
using ReactCRUD.Models;
using System.Data.Entity.Infrastructure;

namespace ReactCRUD.Controllers
{
    public class CustomerController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        //fetch data from database
        [HttpGet]
        public JsonResult GetCustomerData()
        {
            using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
            {
                var customer = dbmodel.Customers.ToList();

                return Json(customer, JsonRequestBehavior.AllowGet);
                //return Json(new { success = true, data = customer });
            }
        }




        // POST: Customer/Create
        [HttpPost]
        public JsonResult Create(Customer customer)
        {
            using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
            {
                if (ModelState.IsValid)
                {
                    var data = dbmodel.Customers.Add(customer);
                    dbmodel.SaveChanges();
                    return Json(new { success = true, data = customer });
                }

                return Json(new { success = false, message = "Invalid customer given" });
            }

        }




        [HttpPut]
        public JsonResult Edit(Customer customer)
        {
            using (CruddataModel1Entities db = new CruddataModel1Entities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        db.Entry(customer).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        var result = db.Customers.SingleOrDefault(a => a.Id == customer.Id);
                        if (result == null)
                        {
                            return Json(new { success = false, message = "Cannot find customer to update" }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            throw;
                        }
                    }

                    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                }
            }

            return Json(new { success = false, message = "Invalid customer given" }, JsonRequestBehavior.AllowGet);
        }
        //[HttpDelete]
        public JsonResult Delete(int Id)
        {
            try
            {
                using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
                {
                    Customer customer = dbmodel.Customers.Find(Id);
                    dbmodel.Customers.Remove(customer);
                    dbmodel.SaveChanges();
                    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                    //return Json(new { success = true });
                }

            }
            catch
            {
                return Json(new { success = false, message = "Cannot find customer to delete" }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}

   