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
    public class StoreController : Controller
    {
        // GET: Store
        public ActionResult Index()
        {
            return View();
        }
        //fetch data from database
        [HttpGet]
        public JsonResult GetStoreData()
        {
            using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
            {
                var store = dbmodel.Stores.ToList();

                return Json(store, JsonRequestBehavior.AllowGet);
                //return Json(new { success = true, data = customer });
            }
        }




        // POST: Customer/Create
        [HttpPost]
        public JsonResult Create(Store store)
        {
            using (CruddataModel1Entities dbmodel = new CruddataModel1Entities())
            {
                if (ModelState.IsValid)
                {
                    var data = dbmodel.Stores.Add(store);
                    dbmodel.SaveChanges();
                    return Json(new { success = true, data = store });
                }

                return Json(new { success = false, message = "Invalid customer given" });
            }

        }




        [HttpPut]
        public JsonResult Edit(Store store)
        {
            using (CruddataModel1Entities db = new CruddataModel1Entities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        db.Entry(store).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        var result = db.Stores.SingleOrDefault(a => a.Id == store.Id);
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
                    Store store = dbmodel.Stores.Find(Id);
                    dbmodel.Stores.Remove(store);
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
