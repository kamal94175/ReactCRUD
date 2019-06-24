using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using ReactCRUD.Models;
using System.Data.Entity.Infrastructure;

namespace ReactCRUD.Controllers
{
   
        public class ProductController : Controller
        {
            public ActionResult Index()
            {
                return View();
            }

            //fetch data from database
            [HttpGet]
            public JsonResult GetProductData()
            {
                using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
                {
                    var product = dbmodel.Products.ToList();

                    return Json(product, JsonRequestBehavior.AllowGet);
                    //return Json(new { success = true, data = customer });
                }
            }




            // POST: Customer/Create
            [HttpPost]
            public JsonResult Create(Product product)
            {
                using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
                {
                    if (ModelState.IsValid)
                    {
                        var data = dbmodel.Products.Add(product);
                        dbmodel.SaveChanges();
                        return Json(new { success = true, data = product });
                    }

                    return Json(new { success = false, message = "Invalid customer given" });
                }

            }




            // POST: Customer/Edit/
            //[HttpPut]
            public JsonResult Edit(Product product)
            {
                try
                {

                    using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
                    {

                        dbmodel.Entry(product).State = EntityState.Modified;
                        dbmodel.SaveChanges();
                        return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                    }
                }
                catch
                {
                    return Json(new { success = false, message = "Cannot find customer to delete" }, JsonRequestBehavior.AllowGet);
                }

            }
            //[HttpDelete]
            public JsonResult Delete(int Id)
            {
                try
                {
                    using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
                    {
                        Product product = dbmodel.Products.Find(Id);
                        dbmodel.Products.Remove(product);
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
