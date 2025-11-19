const User = require("../models/User");

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, tel, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      tel,
      password,
      role,
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
    });
    console.log(err.stack);
  }
};

//@desc   Login user
//@route  POST /api/v1/auth/login
//@access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};

//@desc   Get current Logged in user
//@route  POST /api/v1/auth/me
//@access Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};

//@desc   Log user out / clear cookie
//@route  GET /api/v1/auth/logout
//@access Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
};

//@desc   Update user (name and tel only)
//@route  PUT /api/v1/auth/me
//@access Private
exports.updateUser = async (req, res, next) => {
  try {
    const { name, tel } = req.body;
    
    // Only allow updating name and tel
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (tel !== undefined) updateFields.tel = tel;

    // Validate that at least one field is provided
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name or tel to update'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

//@desc   Delete user
//@route  DELETE /api/v1/auth/me
//@access Private
exports.deleteUser = async (req, res, next) => {
  try {
    const Ticketing = require('../models/Ticketing');
    const Event = require('../models/Event');

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all ticketing reservations for this user
    const ticketings = await Ticketing.find({ user: req.user.id });
    
    // Restore tickets to events
    for (const ticketing of ticketings) {
      const event = await Event.findById(ticketing.event);
      if (event) {
        event.availableTicket += ticketing.ticketAmount;
        await event.save();
      }
    }

    // Delete all ticketing reservations for this user
    await Ticketing.deleteMany({ user: req.user.id });

    // Delete the user
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'User account and all associated reservations deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
