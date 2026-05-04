export const checkCityAccess = (req, res, next) => {
  const adminCity = req.user.city?.toString();

  const resourceCity =
    req.body.city ||
    req.params.city ||
    req.query.city;

  if (resourceCity && resourceCity !== adminCity) {
    return res.status(403).json({
      message: "You can only access your assigned city data",
    });
  }

  next();
};