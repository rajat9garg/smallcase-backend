const {sendError} = require("../handlers/response.handler")

const uservalidation = async(req,res,next)=>{
    // validation for req
    if(req && req.body.name){
        let name = req.body.name
        if(typeof name === "string" && name.length === 0){
            return sendError(res, { msg: "Name Bad Input" }, 400);
        }
    }
    if(req && req.body.email){
        let email = req.body.email
        if(typeof email === "string" && email.length === 0){
            return sendError(res, { msg: "Email Bad Input" }, 400);
        }
    }
    next()
}

module.exports.uservalidation = uservalidation