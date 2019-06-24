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
    public class SalesController : Controller
    {
        // GET: Sales
        public ActionResult Index()
        {
            return View();
        }
        //fetch data from database
        [HttpGet]
        public JsonResult GetSalesData()
        {
            using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
            {
                var sale = dbmodel.Sales.Include("Customer")
                                        .Include("Product")
                                        .Include("Store").ToList();
                var saledata = sale.Select(x => new
                {
                    x.Id,
                    CustomerName =
                                                             x.Customer.Name,
                    ProductName =
                                                             x.Product.Name,
                    StoreName =
                                                             x.Store.Name,
                    DateSold = x.DateSold.ToString("yyyy/MM/dd")
                });
                                                             
                return Json(saledata, JsonRequestBehavior.AllowGet);
                //return Json(new { success = true, data = customer });
            }

        }
        [HttpPost]
        public JsonResult Create(Sale sale)
        {
            using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
            {
                if (ModelState.IsValid)
                {
                    var data = dbmodel.Sales.Add(sale);
                    dbmodel.SaveChanges();
                    return Json(new { success = true });
                }

                return Json(new { success = false, message = "Invalid customer given" });
            }

        }




        [HttpPut]
        public JsonResult Edit(Sale sale)
        {
            using (CruddataModel1Entities db = new CruddataModel1Entities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        db.Entry(sale).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        var result = db.Sales.SingleOrDefault(a => a.Id == sale.Id);
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
                    Sale del = dbmodel.Sales.Find(Id);
                    dbmodel.Sales.Remove(del);
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
