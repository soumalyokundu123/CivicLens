const { signupValidation } = require('../Middlewares/AuthValidation');
const { signup, login, listUsers } = require('../Controllers/AuthController'); 

const { loginValidation } = require('../Middlewares/AuthValidation');
const router=require('express').Router();

router.post('/login',loginValidation,login);
router.post('/signup',signupValidation,signup);
router.get('/users', listUsers);
module.exports=router;