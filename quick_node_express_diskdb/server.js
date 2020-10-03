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
   const items = db.orders.find({ _id: itemId });
   if (items.length) {
      res.json(items);
   } else {
      res.json({ error: `Order with ${itemId} doesn't exist` })
   }
});

// 5. GET item price by number - GET /itemPrice/{itemNumber}
server.get("/itemPrice/:itemNumber", (req, res) => {
   const itemNumber = req.params.itemNumber;
   const items = db.orders.find({ commerceItemId: itemNumber });
   if (items.length) {
      // res.json(items);
      if (items[0].order.commerceItems.length)
         res.json({ "listPrice": items[0].order.commerceItems[0].priceInfo.listPrice });
      else
         res.json({ message: `Item with ${itemNumber} doesn't exist` })
   } else {
      res.json({ error: `Item with ${itemNumber} doesn't exist` })
   }
});

// 2. Update Order by Id - PUT /order/{id}
server.put("/order/:id", (req, res) => {
   const itemId = req.params.id;
   const item = req.body;
   const items = db.orders.find({ _id: itemId });

   if (items.length)
      res.json(db.orders.update({ _id: itemId }, item));
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