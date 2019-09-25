import User from "../models/user";
import cuid from "cuid";

const UserController = {};

// Index: list all users
UserController.getUsers = async (req, res) => {
  try {
    await User.find()
      .sort("-createdAt")
      .exec((err, users) => {
        if (err) {
          res.status(500).send(err);
        }
        res.json({ users });
      });
  } catch (err) {
    res.send(err);
  }
};

// Store: Add a new user
UserController.storeUser = async (req, res) => {
  try {
    const newUser = new User(req.body.user);
    console.log(newUser);

    // sanitize input
    newUser.id = cuid();
    newUser.name = newUser.name;
    newUser.email = newUser.email;
    newUser.password = newUser.password;

    newUser.save((err, saved) => {
      if (err) {
        res.status(500).send(err);
      }

      res.json({ user: saved });
    });
  } catch (error) {
    console.error(error);
  }
};
