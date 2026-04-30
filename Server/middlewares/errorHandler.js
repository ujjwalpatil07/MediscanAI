export default (err, req, res, _next) => {

  const status = err.status || 400;

  res.status(status).json({
    error: err.message || "Something went wrong",
    requestId: req.id,
  });
};
