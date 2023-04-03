const { CustomAPIError } = require("../errors/custom-error")

const handleError = (err,req,res,next) => {
    if(err instanceof CustomAPIError){
        return res.status(err.statusCode).json({msg:err.message})
    }
    return res.status(500).json({msg:'Something went wrong,try again'})
}

module.exports = handleError