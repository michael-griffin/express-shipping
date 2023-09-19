"use strict";

const fetchMock = require("fetch-mock");

const {
  shipProduct, SHIPIT_SHIP_URL
} = require("./shipItApi");

//FIXME: include all other fields so they get data as expected
test("shipProduct", async function () {
  fetchMock.post(`${SHIPIT_SHIP_URL}`, {
    body: {
      "receipt": {"shipId": 6464}
    }
  });

  const res = await shipProduct({
    productId: 1000,
    name: "Test Tester",
    addr: "100 Test St",
    zip: "12345-6789",
  });

  expect(res).toEqual(6464);
});
