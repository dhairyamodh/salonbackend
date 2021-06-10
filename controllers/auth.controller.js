const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services')

const login = catchAsync(async (req, res) => {
    const result = await authService.login(req.body);
    return res.status(result.status).send(result)
})

const details = catchAsync(async (req, res) => {
    const result = await authService.details(req.userId);
    return res.status(result.status).send(result)
})

const forgotpassword = catchAsync(async (req, res) => {
    const result = await authService.forgotpassword(req.body);
    return res.status(result.status).send(result)
})

const changeForgotPassword = catchAsync(async (req, res) => {
    const result = await authService.changeForgotPassword(req.body);
    return res.status(result.status).send(result)
})

module.exports = {
    login, details, forgotpassword, changeForgotPassword
};
