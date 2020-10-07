const express = require('express');
const server = express();

const body_parser = require('body-parser');

const port = process.env.PORT || 5000;

// const db = require('./')

// diskdb connection
const db = require('diskdb');
db.connect('./data', ['orders', 'users']);

// add first movie
// if (!db.orders.find().length) {
//    const movie = { id: "tt0110357", name: "", genre: "" };
//    db.orders.save(movie);
// }

// parse JSON (application/json content-type)
server.use(body_parser.json());

server.get("/", (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

// 3. Get All Orders - GET /orders
server.get("/order", (req, res) => {
   res.json(db.orders.find());
});

//4. Get Order by Id - GET /order/{id}
server.get("/order/:id", (req, res) => {
   const itemId = req.params.id;
   const items = db.orders.find();
   let response = { error: `Order with ${itemId} doesn't exist` };
   if (items.length) {
      items.forEach(element => {
         if (element.order.id == itemId)
            response = element;
      });
   }
   res.json(response)
});

// 5. GET item price by number - GET /itemPrice/{itemNumber}
server.post("/itemPrice", (req, res) => {
   const productId = req.body.items[0].productId;
   const items = db.orders.find({ productId: productId });
   if (items.length) {
      let response = {
         "items": [
            {
               "productId": items[0].order.commerceItems[0].productId,
               "catRefId": items[0].order.commerceItems[0].productId,
               "externalPrice": items[0].order.commerceItems[0].priceInfo.listPrice,
               "externalPriceQuantity": 1000
            }
         ]
      };

      if (items[0].order.commerceItems.length)
         res.json(response);

      // res.json({ "listPrice": items[0].order.commerceItems[0].priceInfo.listPrice });
      else
         res.json({ message: `Item with productId: ${productId} doesn't exist` })
   } else {
      res.json({ error: `Item with productId: ${productId} doesn't exist` })
   }
});

// 2. Update Order by Id - PUT /order/{id}
server.put("/order/:id", (req, res) => {
   const itemId = req.params.id;
   const state = req.body.state;
   const items = db.orders.find({ id: itemId });

   if (items.length) {
      items.forEach(element => {
         if (element.order.id == itemId) {
            db.orders.remove(element);
            element.order.state = state;
            res.json(db.orders.save(element));
         }
      });
      // res.json(db.orders.update({ id: itemId }, {"": items}));
   }
   else
      res.json({ error: `Order with ${itemId} doesn't exist` })

});

// 2. Return Order by Id - PUT /order/{id}
server.post("/return/order/:id", (req, res) => {
   const itemId = req.params.id;
   const state = req.body.state;
   const items = db.orders.find({ id: itemId });

   if (items.length) {
      items.forEach(element => {
         if (element.order.id == itemId) {
            let response = { "return": { "agentId": null, "authorizationDate": "2020-09-29T13:26:48.097Z", "refundSubtotal": 30, "relatedReplacementOrders": [], "refundMethodList": [{ "refundType": "manualRefund", "amount": 30, "maximumRefundAmount": -1 }], "allocatedAmount": 30, "originatingOrder": { "gwp": false, "secondaryCurrencyCode": null, "submittedDate": "2020-09-29T13:26:09.000Z", "salesChannel": "default", "configuratorId": null, "organizationId": "400002", "relationships": [{ "paymentGroupId": "pg53809", "amount": 30, "relationshipType": "ORDERAMOUNTREMAINING", "id": "r91856" }], "exchangeRate": null, "id": element.order.id, "state": "NO_PENDING_ACTION", "taxCalculated": true, "combinedPriceInfos": null, "commerceItems": [{ "gwp": false, "deactivationDate": null, "returnedQuantity": 1, "availabilityDate": null, "billingProfileId": null, "externalData": [], "billingAccountId": null, "preOrderQuantity": 0, "assetKey": null, "commerceItemId": "ci15112368623071", "priceInfo": { "discounted": false, "amount": 20, "secondaryCurrencyShippingSurcharge": 0, "rawTotalPrice": 20, "salePrice": 0, "orderDiscountInfos": [], "priceListId": "listPrices", "itemDiscountInfos": [], "quantityDiscounted": 0, "amountIsFinal": false, "onSale": false, "shippingSurcharge": 0, "discountable": true, "currentPriceDetailsSorted": [{ "secondaryCurrencyTaxAmount": 0, "discounted": false, "amount": 20, "quantity": 1, "configurationDiscountShare": 0, "amountIsFinal": false, "range": { "lowBound": 0, "highBound": 0, "size": 1 }, "tax": 0, "orderDiscountShare": 0, "detailedUnitPrice": 20, "currencyCode": "USD" }], "currencyCode": "USD", "listPrice": 20 }, "catalogId": null, "externalRecurringChargeDetails": null, "externalPriceDetails": null, "actionCode": null, "id": "ci5002557", "state": "INITIAL", "serviceId": null, "locationInventoryInfoMap": {}, "serviceAccountId": null, "quantity": 0, "pointOfNoRevision": false, "productId": "box2", "parentAssetKey": null, "externalId": null, "originalCommerceItemId": null, "rootAssetKey": null, "transactionDate": null, "catalogRefId": "box2", "customerAccountId": null, "recurringChargePriceInfo": null, "lineAttributes": [], "catalogKey": null, "productDisplayName": "Cardboard box 2", "shopperInput": {}, "activationDate": null, "asset": false, "backOrderQuantity": 0 }], "shippingGroups": [{ "shippingMethod": "sm10001", "description": "sg53647", "submittedDate": null, "priceInfo": { "secondaryCurrencyTaxAmount": 0, "discounted": false, "shippingTax": 0, "secondaryCurrencyShippingAmount": 0, "amount": 10, "rawShipping": 10, "amountIsFinal": false, "currencyCode": "USD" }, "shipOnDate": null, "actualShipDate": null, "specialInstructions": {}, "shippingAddress": { "country": "SA", "lastName": "Name", "address3": "", "city": "City", "address2": "", "prefix": "", "address1": "Line", "companyName": "", "jobTitle": "", "postalCode": "123123", "county": "", "ownerId": null, "suffix": "", "firstName": "Name", "phoneNumber": "123123123", "faxNumber": "", "middleName": "", "state": "08", "email": "napco-bp07@box.hycom.pl" }, "commerceItemRelationships": [{ "availablePickupDate": null, "inventoryLocationId": null, "amount": 0, "quantity": 0, "pointOfNoRevision": false, "relationshipType": "SHIPPINGQUANTITY", "returnedQuantity": 1, "preferredPickupDate": null, "range": { "lowBound": 0, "highBound": 0, "size": 1 }, "commerceItemExternalId": null, "commerceItemId": "ci5002557", "state": "INITIAL", "id": "r91854" }], "state": "INITIAL", "id": "sg53647", "stateDetail": null, "trackingNumber": null, "handlingInstructions": [], "shippingGroupClassType": "hardgoodShippingGroup" }], "freezeDate": null, "taxExempt": false, "profile": { "lastName": "Last", "firstName": "First", "loyaltyPrograms": [], "shippingAddress": null, "middleName": null, "login": "napco-bp07@box.hycom.pl", "parentOrganization": { "name": "Company_1600427125316", "id": "400002" }, "email": "napco-bp07@box.hycom.pl" }, "queuedOrderSubmitData": null, "cartName": "o52042", "paymentInitiatedEmailSent": false, "payShippingInSecondaryCurrency": false, "shippingGroupCount": 1, "taxExemptionCode": null, "createdByOrderId": null, "orderAction": "order", "submissionErrorMessages": [], "profileId": "682126", "activeQuoteOrderId": null, "approverIds": [], "agentId": null, "lastModifiedTime": 1601386008096, "priceGroupId": "defaultPriceGroup", "creationTime": 1601385934000, "sourceSystem": "Cloud Commerce", "gwpMarkers": [], "locale": "en", "paymentGroups": [{ "PONumber": "123", "amountAuthorized": 30, "amount": 30, "gatewayName": "invoice", "paymentProps": {}, "submittedDate": "2020-09-29T13:26:09.840Z", "authorizationStatus": [{ "amount": 30, "statusProps": { "occs_tx_id": "o52042-pg53809-1601385969840" }, "transactionSuccess": true, "errorMessage": null, "externalStatusProps": [], "transactionId": null, "transactionTimestamp": null }], "paymentGroupClassType": "invoiceRequest", "paymentMethod": "invoiceRequest", "billingAddress": { "country": "SA", "lastName": "Name", "address3": "", "city": "City", "address2": "", "prefix": "", "address1": "Line", "companyName": "", "jobTitle": "", "postalCode": "123123", "county": "", "ownerId": null, "suffix": "", "firstName": "Name", "phoneNumber": "123123123", "faxNumber": "", "middleName": "", "state": "08", "email": "napco-bp07@box.hycom.pl" }, "state": "PAYMENT_DEFERRED", "id": "pg53809", "debitStatus": [], "currencyCode": "USD" }], "payTaxInSecondaryCurrency": false, "priceInfo": { "secondaryCurrencyTaxAmount": 0, "discounted": false, "secondaryCurrencyShippingAmount": 0, "amount": 20, "secondaryCurrencyTotal": 0, "manualAdjustmentTotal": 0, "discountAmount": 0, "tax": 0, "rawSubtotal": 20, "total": 30, "shipping": 10, "primaryCurrencyTotal": 20, "amountIsFinal": false, "currencyCode": "USD" }, "submissionProgress": [], "catalogId": null, "totalCommerceItemCount": 0, "externalContext": false, "cancelReason": null, "quoteInfo": null, "taxPriceInfo": { "secondaryCurrencyTaxAmount": 0, "discounted": false, "valueAddedTax": 0, "amount": 0, "countyTax": 0, "isTaxIncluded": false, "miscTax": 0, "districtTax": 0, "stateTax": 0, "miscTaxInfo": {}, "countryTax": 0, "cityTax": 0, "amountIsFinal": false, "currencyCode": "USD" }, "allowAlternateCurrency": false, "approverMessages": [], "orderUpdationRemarks": null, "paymentGroupCount": 1, "submissionErrorCodes": [], "recurringChargePriceInfo": null, "organization": { "repositoryId": "400002", "name": "Company_1600427125316", "active": true, "id": "400002" }, "siteId": "siteUS" }, "suggestedShippingRefund": 10, "returnPaymentState": "Refund", "processName": "Return", "processImmediately": false, "orderCurrencyCode": "USD", "returnAdjustedOrderId": null, "returnCalculationOrder": null, "state": "PENDING_CUSTOMER_ACTION", "unAdjustedRefundSubtotal": 20, "returnItemCount": 1, "trackingNumber": null, "totalOrderPromotionValueAdjustmentChange": 0, "comments": null, "profile": { "lastName": "Last", "firstName": "First", "loyaltyPrograms": [], "shippingAddress": null, "middleName": null, "id": "682126", "login": "napco-bp07@box.hycom.pl", "parentOrganization": { "approvalRequired": false, "contract": { "id": "400001" }, "name": "Company_1600427125316", "repositoryId": "400002", "active": true, "description": null, "shippingAddress": null, "secondaryAddresses": { "Address1": { "lastName": null, "country": "PL", "firstName": null, "city": "City", "address1": "Address", "postalCode": "90-100", "repositoryId": "682128", "middleName": null, "state": "LD" } }, "billingAddress": null, "id": "400002" }, "email": "napco-bp07@box.hycom.pl" }, "suggestedTaxRefund": 0, "nonReturnItemCostAdjustments": [], "replacementOrder": null, "actualShippingRefund": 10, "otherRefund": 0, "actualTaxRefund": 0, "totalItemRefund": 20, "processed": false, "returnLabel": null, "authorizationNumber": "100002", "returningItems": true, "replacingItems": false, "returnFee": 0, "exchangeProcess": false, "totalReturnItemRefund": 20, "submitExchangeAllowed": false, "totalRefundAmount": 30, "originOfReturn": "default", "unallocatedAmount": 0, "additionalProperties": {}, "nonReturnItemSubtotalAdjustment": 0, "originatingOrderId": "o52042", "replaceItemCount": 0, "adjustmentAmount": 10, "returnItemList": [{ "quantityReturned": 1, "quantityToReturn": 1, "quantityAvailable": 0, "returnItemId": "100002", "suggestedTaxRefundShare": 0, "quantityToExchange": 0, "itemCurrencyCode": "USD", "shippingGroupId": "sg53647", "description": "Box2", "catalogRefId": "box2", "suggestedShippingRefundShare": 10, "commerceItemId": "ci5002557", "disposition": null, "quantityShipped": -1, "returnReason": "didNotLike", "itemCostAdjustments": [{ "commerceItemId": "ci5002557", "shippingGroupId": "sg53647", "amountAdjustment": -20, "shippingShareAdjustment": 0, "quantityAdjusted": 1, "orderDiscountShareAdjustment": 0, "manualAdjustmentShareAdjustment": 0, "taxShareAdjustment": 0 }, { "commerceItemId": "ci5002557", "shippingGroupId": "sg53647", "amountAdjustment": 0, "shippingShareAdjustment": -10, "quantityAdjusted": 0, "orderDiscountShareAdjustment": 0, "manualAdjustmentShareAdjustment": 0, "taxShareAdjustment": 0 }], "childReturnItems": [], "actualShippingRefundShare": 10, "suggestedRefundAmount": 20, "actualTaxRefundShare": 0, "quantityReceived": 0, "refundAmount": 20 }] } };
            db.orders.remove(element);
            element.order.state = "NO_PENDING_ACTION";
            db.orders.save(element);
            res.json(response);
         }
      });
      // res.json(db.orders.update({ id: itemId }, {"": items}));
   }
   else
      res.json({ error: `Order with ${itemId} doesn't exist` })

});

// 1. Create Order - POST /order
server.post("/order", (req, res) => {
   const item = req.body;
   db.orders.save(item);
   res.json(db.orders.find());
});


// 2. Get All Users - GET /users
server.get("/customer", (req, res) => {
   res.json(db.users.find());
});

// 1. Create User - POST /user
server.post("/customer", (req, res) => {
   const item = req.body;
   db.users.save(item);
   res.json(db.users.find());
});

// 4. Update User by Id - POST /user/{id}
server.put("/customer/:id", (req, res) => {
   const itemId = req.params.id;
   const item = req.body;

   const items = db.users.find({ _id: itemId });
   if (items.length) {
      res.json(db.users.update({ _id: itemId }, item));
   } else {
      res.json({ error: `User with ${itemId} doesn't exist` })
   }
});


//4. Get Order by Id - GET /order/{id}
server.get("/customer/:id", (req, res) => {
   const itemId = req.params.id;
   const items = db.users.find({ _id: itemId });
   if (items.length) {
      res.json(items);
   } else {
      res.json({ error: `User with ${itemId} doesn't exist` })
   }
});

// // delete item from list
// server.delete("/items/:id", (req, res) => {
//    const itemId = req.params.id;
//    console.log("Delete item with id: ", itemId);

//    db.orders.remove({ id: itemId });

//    res.json(db.orders.find());
// });


server.listen(port, () => {
   console.log(`Server listening at ${port}`);
});