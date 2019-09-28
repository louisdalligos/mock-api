const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require("express-validator");

// get our User model
const User = require("../models/UserModel");

// get our Therapy model
const Therapy = require("../models/TherapyModel");

// @route    GET api/therapies
// @desc     Get theraphy articles
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
      const therapies = await Therapy.find({ user: req.user.id }).sort({ date: -1 });
      res.json(therapies)
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
  }
});

// @route    POST api/therapies
// @desc     Add new therapy article
// @access   Private
router.post(
    "/", 
    [ 
        auth, [
            check('title', 'Title is required')
                .not()
                .isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, status } = req.body;

        try {
            const newTherapy = new Therapy({
                title,
                description,
                status,
                user: req.user.id
            });

            const therapy = await newTherapy.save();

            res.json(therapy)
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }
);

// @route    PUT api/therapies/:id
// @desc     Update/Edit therapy article
// @access   Private
router.put("/:id", auth, async (req, res) => {
    const { title, description, status } = req.body;

    // Build therapy object
    const theraphyFields = {};

    if (title) theraphyFields.title = title;
    if (description) theraphyFields.description = description;
    if (status) theraphyFields.status = status;

    try {
        let theraphy = await Therapy.findById(req.params.id);

        if (!theraphy) return res.status(404).json({ msg: 'Therapy not found'});

        // make sure user owns the article
        if (theraphy.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'You are not authorized to perform this action'});
        }

        // update logic
        theraphy = await Therapy.findByIdAndUpdate(
            req.params.id, 
            { $set: theraphyFields },
            { new: true }
        );

        res.json(theraphy);
    } catch (err) {
        console.error(err.message)
    }
});


// @route    DELETE api/therapies/:id
// @desc     Delete therapy article
// @access   Private
router.delete("/:id", auth, async (req, res) => {


    try {
        let theraphy = await Therapy.findById(req.params.id);

        if (!theraphy) return res.status(404).json({ msg: 'Therapy not found'});

        // make sure user owns the article
        if (theraphy.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'You are not authorized to perform this action'});
        }

        await Therapy.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Article has been removed' });
    } catch (err) {
        console.error(err.message)
    }
});


module.exports = router;
