module.exports.checkUser = (req, res, next) => {
  req.user = {
    _id: "63659e74a3429fb348b86dbe",
  };
  next();
};
