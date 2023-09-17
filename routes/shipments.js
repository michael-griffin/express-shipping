"use strict";

const jsonschema = require("jsonschema");
const orderSchema = require("../schemas/shippingschema.json");
const multiSchema = require("../schemas/multischema.json");

const express = require("express");
const { BadRequestError } = require("../expressError");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 *
 * if invalid, returns a list of errors where body did not match schema
 */
router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(
    req.body, orderSchema, {required: true});

  if (!result.valid){
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});


router.post("/multi", async function (req, res) {
  const result = jsonschema.validate(
    req.body, multiSchema, {required: true});

  if (!result.valid){
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const { productIds, name, addr, zip } = req.body;

  console.log("res.body is: ", res.body);

  const shipIdPromises = productIds.map(productId => {
    return shipProduct({ productId, name, addr, zip });
  })

  const shipIds = await Promise.all(shipIdPromises);
  console.log("shipIds is :", shipIds);
  return res.json({ shipped: shipIds });
  // const shipId = await shipProduct({ productId, name, addr, zip });
})

module.exports = router;


//
// router.post("/", async function (req, res, next) {
//   if (req.body === undefined) {
//     throw new BadRequestError();
//   }
//   const { productId, name, addr, zip } = req.body;
//   const shipId = await shipProduct({ productId, name, addr, zip });
//   return res.json({ shipped: shipId });
// });
