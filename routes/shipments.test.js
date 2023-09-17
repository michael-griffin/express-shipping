"use strict";

const shipItApi = require("../shipItApi")
shipItApi.shipProduct = jest.fn()

const request = require("supertest");
const app = require("../app");



/** tests post route for successful post, invalid schema, and empty body */
describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(6464);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 6464 });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if input to API does not match schema", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 999,
        name: 12,
        addr: 100,
        zip: "12345-678",
      });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual( {"error":
      {"message": ["instance.productId must be greater than or equal to 1000",
        "instance.name is not of a type(s) string",
        "instance.addr is not of a type(s) string",
        "instance.zip does not meet minimum length of 10",
        "instance.zip does not match pattern \"^[0-9]{5}-[0-9]{4}\"",],
      "status": 400}});
  })
});



describe("POST to new multi shipment route", function () {
  test("valid multi post", async function () {
    shipItApi.shipProduct.mockReturnValueOnce(1001);
    shipItApi.shipProduct.mockReturnValueOnce(1002);
    shipItApi.shipProduct.mockReturnValueOnce(1003);
    shipItApi.shipProduct.mockReturnValueOnce(1004);
    const resp = await request(app).post("/shipments/multi").send({
      productIds: [1000, 1001, 1002, 1003],
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({ shipped: [1001, 1002, 1003, 1004] });
  });

  test("fail if empty request", async function () {
    const resp = await request(app).post("/shipments/multi").send();
    // expect(resp.status).toEqual(400);
    expect(resp.body).toEqual({"error": {
      "message": ["instance is required, but is undefined"],
     "status": 400}});
  })

  test("fail if wrong schema", async function () {

    const resp = await request(app).post("/shipments/multi").send({
      productId: 1000,
      name: "Poor test, not multi",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.status).toEqual(400);
    expect(resp.body).toEqual({"error": {
      "message": ["instance is not allowed to have the additional property \"productId\"",
      "instance requires property \"productIds\""], "status": 400}});
  })

});