const Joi = require('joi')
function validateCourse(course) {

    let schema = Joi.object({
        id: Joi.required(),
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().max(100).required().email(),
        phone: Joi.number().min(9).required(),
        password: Joi.string().min(4).max(100).required()
    })

    let result = schema.validate(course)
    return result
}
module.exports = validateCourse;