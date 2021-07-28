const httpStatus = require('http-status');
const { dailyReportService, cashBookReportService, expenseReportService, serviceReportService, orderReportService, salesReportService } = require('../reports')

const reportType = (db, data) => {

    switch (data.reportType) {
        case "dailyreport":
            return dailyReportService.getOrderReport(db, data)

        case "cashbook":
            return cashBookReportService.getOrderReport(db, data)

        case "expensereport":
            return expenseReportService.getReport(db, data)

        case "servicereport":
            return serviceReportService.getReport(db, data)

        case "orderreport":
            return orderReportService.getReport(db, data)

        case "salesreport":
            return salesReportService.getReport(db, data)
        default:
            break;
    }
}

const all = async (db, data) => {
    try {
        const response = await reportType(db, data)
        return ({ status: response.status, data: response.data })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    all
}