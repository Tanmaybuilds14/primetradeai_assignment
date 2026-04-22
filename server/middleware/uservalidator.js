import {body,validationResult} from 'express-validator';

const userValidator = [
  body('username')
  .notEmpty().withMessage('Please enter your username')
  .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
  .trim(),

  body('email')
  .notEmpty().withMessage('Please enter your email')
  .isEmail().withMessage('Please enter a valid email')
  .normalizeEmail(),

  body('password')
  .notEmpty().withMessage('Enter a password')
  .isLength({min:6})
  .trim(),

  function(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({msg:errors.array()});
    }
    next();
  }
  
];

export default userValidator 