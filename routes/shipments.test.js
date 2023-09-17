"use strict";

const request = require("supertest");
const app = require("../app");


/** tests post route for successful post, invalid schema, and empty body */
describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
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
        zip: "12",
      });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual( {"error":
      {"message": ["instance.productId must be greater than or equal to 1000",
        "instance.name is not of a type(s) string",
        "instance.addr is not of a type(s) string",
        "instance.zip does not meet minimum length of 5"],
      "status": 400}});
  })
});
