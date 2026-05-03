const router = require("express").Router();
const Room = require("../models/Room");

router.post("/", async (req, res) => {
  const room = await Room.create(req.body);
  res.json(room);
});

router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

module.exports = router;
