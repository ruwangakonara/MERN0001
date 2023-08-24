const isAdmin = (req, res, next) => {
    const user = req.user; 
    if (user && user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden' }); 
};


module.exports = isAdmin