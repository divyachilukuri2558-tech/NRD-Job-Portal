// Checks if the user role has the required permission
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: User role not identified.'
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: [${allowedRoles.join(', ')}]. Your role is '${req.userRole}'.`
      });
    }

    next();
  };
};

module.exports = {
  authorizeRole
};
