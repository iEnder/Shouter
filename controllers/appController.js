const mongoose = require('mongoose');
const User = mongoose.model('User');
const shout = mongoose.model('Shout');

exports.index = (req, res, next) => {
  // req.flash('success', 'Test Flash');
  // req.flash('error', 'Test Flash');
  // req.flash('info', 'Test Flash');
  if (req.user) {
    return next();
  }
  res.render('landing', { title: 'Welcome!' });
};

exports.homePage = async (req, res) => {
  const populatedUser = await User.findById(req.user._id).deepPopulate([
    'following.shouts.author',
    'shouts.author'
  ]);

  let shouts = populatedUser.following.reduce((a, b) => {
    a = a.concat(b.shouts);
    return a;
  }, []);

  shouts = shouts.concat(populatedUser.shouts);

  // sort shouts by date
  shouts.sort(function(a, b) {
    let keyA = new Date(a.created);
    let keyB = new Date(b.created);
    // Compare the 2 dates
    if (keyA < keyB) return 1;
    if (keyA > keyB) return -1;
    return 0;
  });

  res.render('index', { title: 'index', shouts });
};

exports.testRoute = async (req, res) => {
  shout.findOne().populate('replies');
};
