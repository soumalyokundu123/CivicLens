const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

const signup = async (req, res) => {
  try {
    const { name, email, password, category } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists, LOGIN instead',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword, category });
    const savedUser = await newUser.save();

    // Include user data in the response
    res.status(201).json({
        message: "User created successfully",
        success: true,
        user: {
            name: savedUser.name,
            email: savedUser.email,
            category: savedUser.category
  }
});

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message,
    });
  }
};



const login = async (req, res) => {
    try {
        const {  email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = "Invalid email or password"    
        if (!user) {
            return res.status(403).json(
                {
                    message:errorMsg,
                    success:false
                }
            )
        }
       const isPassEqual=await bcrypt.compare(password,user.password)
       if(!isPassEqual){
        return res.status(403).json(
            {
                message:errorMsg,
                success:false
            }
        )
       }
       const jwtToken=jwt.sign(
        {email:user.email,_id:user.id,category:user.category},
        process.env.JWT_SECRET,
        {expiresIn:'24h'}
       )


       res.status(200).json({
        message: "Login successful",
        success: true,
        jwtToken,
        user: {
            name: user.name,
            email: user.email,
            category: user.category
  }
});

    }
    catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: err.message
    });
}

}

// List users (optionally filter by category)
const listUsers = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const users = await UserModel.find(filter).select('name email category');
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

module.exports = { signup ,login, listUsers }