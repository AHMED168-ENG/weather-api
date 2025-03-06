import { body, ValidationChain } from 'express-validator';

export class ValidationMiddleware {
    static registerValidation(): ValidationChain[] {
        return [
            body('username')
                .isString().withMessage('Username must be a string')
                .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
            body('email')
                .isEmail().withMessage('Invalid email format'),
            body('password')
                .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
                .matches(/\d/).withMessage('Password must contain a number'),
        ];
    }

    static loginValidation(): ValidationChain[] {
        return [
            body('email')
                .isEmail().withMessage('Invalid email format'),
            body('password')
                .notEmpty().withMessage('Password is required'),
        ];
    }
}
