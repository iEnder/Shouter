const mongoose = require('mongoose');
const Shout = mongoose.model('Shout');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const fs = require('fs');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    // if the file isnt an image reject it
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That filetype isn't allowed!" }, false);
    }
  }
};

exports.upload = multer(multerOptions).single('image');

exports.saveFile = async (req, res, next) => {
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  // setup file name
  const extension = req.file.mimetype.split('/')[1];
  req.body.image = `${uuid.v4()}.${extension}`;

  const image = await jimp.read(req.file.buffer);
  // save file to uploads folder
  await image.write(`./public/uploads/${req.body.image}`);
  next();
};

exports.createshout = async (req, res) => {
  // set author of shout to user
  req.body.author = req.user._id;
  // save shout
  const shout = await new Shout(req.body).save();
  console.log(shout);

  // find author
  const author = await User.findById(shout.author);
  // add shout to authors shouts
  author.shouts.unshift(shout._id);
  await author.save();

  // redirect user with saved message
  req.flash('success', `shout Saved`);
  res.redirect('back');
};

exports.deleteshout = async (req, res) => {
  const shout = await Shout.findById(req.params.id);

  // make sure user owns shout
  if (shout.author.equals(req.user._id)) {
    // find user
    const user = await User.findById(req.user._id);
    // remove shout from users shout list
    await user.shouts.pull(shout._id);
    // if there is a image attached to shout delete it from server
    if (shout.image) {
      await fs.unlink(`./public/uploads/${shout.image}`);
    }
    // delete shout
    await shout.remove();
    // save user
    await user.save();
    // send user back with success message to notify shout was deleted
    req.flash('success', 'shout removed!');
    res.redirect('back');
  } else {
    req.flash('error', 'You do not have permission to do that!');
    res.redirect('back');
  }
};

exports.likeshout = async (req, res) => {
  // turn Id Objects into strings for searching
  const likes = req.user.likes.map(obj => obj.toString());

  // if target is in users likes
  const userHasLiked = likes.includes(req.params.id);

  // find user and add target to likes list
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { [userHasLiked ? '$pull' : '$addToSet']: { likes: req.params.id } },
    { new: true }
  );

  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findByIdAndUpdate` call.
    await Shout.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      { $inc: { likes: userHasLiked ? -1 : 1 } }
    );
  }

  res.json(user);
};
