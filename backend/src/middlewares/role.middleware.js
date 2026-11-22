const { errorResponse } = require('../utils/apiResponse');

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return errorResponse(res, 403, 'FORBIDDEN', 'Bạn không có quyền thực hiện hành động này');
  }
  next();
};

module.exports = {
  requireAdmin,
};
