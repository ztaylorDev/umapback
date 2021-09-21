const router = require("express").Router();
const Pin = require("../models/Pin");

//get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:pinId", async (req, res) => {
  try {
    const pins = await Pin.findById(req.params.pinId);
    return res.send(pins);
  } catch (ex) {
    return res.status(500).send(`internal server error:${ex}`);
  }
});

//create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:pinId", async (req, res) => {
  try {
    let pin = await Pin.findByIdAndUpdate(req.params.pinId, {
      username: req.body.username,
      title: req.body.title,
      desc: req.body.desc,
      rating: req.body.rating,
      long: req.body.long,
      lat: req.body.lat,
    });
    if (!pin)
      return res
        .status(400)
        .send(`The pin with id "${req.params.pinId}" does not exist.`);
    await pin.save();
    return res.send({ _id: pin._id, username: pin.name });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.delete("/:pinId", async (req, res) => {
  try {
    const pin = await Pin.findByIdAndRemove(req.params.pinId);
    if (!pin)
      return res
        .status(400)
        .send(`The pin with id "${req.params.userId}" does not exist.`);
    return res.send(pin);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
