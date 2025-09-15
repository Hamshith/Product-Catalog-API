const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token =authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success : false,
            message : "Access Denied. No token provided .Please Login to continue"
        });
    }

    //Decode this token
    try{
        const decodedTokenInfo = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.userInfo = decodedTokenInfo;
        next()
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Something went wrong"
        });
    }
}

module.exports = authMiddleware;