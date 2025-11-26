const { getUser } = require('../service/auth')

// function extractToken(authHeader) {
//     if (!authHeader) return null;
//     // Support both "Bearer <token>" and raw token
//     if (authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim();
//     return authHeader.trim();
// }




// async function restrictToLoggedInUserOnly(req, res, next) {
//     // Prefer Authorization header; cookies can be added later if needed
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) return res.redirect('/login');

//     const token = extractToken(authHeader);
//     const user = getUser(token);

//     if (!user) return res.redirect('/login');

//     req.user = user;
//     next();
// }

// async function checkAuth(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     // This middleware is permissive: populate req.user if token is present, otherwise continue
//     if (!authHeader) {
//         req.user = null;
//         return next();
//     }

//     const token = extractToken(authHeader);
//     const user = getUser(token);
//     req.user = user || null;
//     next();
// }



function checkForAuthentication(req , res , next){
    req.user = null;

    // Try Authorization header first: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
    }

    // Fallback to cookie set during login: token=<jwt>
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) return next();

    const user = getUser(token);
    req.user = user || null;
    return next();
}

function restrictTo(roles=[]){
    return function (req , res , next){
        if(!req.user) return res.redirect('/login');
        

        if(!roles.includes(req.user.role)) return res.end('unauthorized access');

        return next();
    }
}



module.exports = {
    checkForAuthentication , restrictTo
}