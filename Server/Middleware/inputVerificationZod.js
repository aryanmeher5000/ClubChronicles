function inputVerification(zodSchema) {
  return function (req, res, next) {
    if (!req?.body || typeof req?.body !== "object") return res.status(400).json({ error: "Provide valid details!" });

    const { success, error, data } = zodSchema.safeParse(req.body);
    if (!success) {
      const err = error?.issues[0]?.message;
      return res.status(400).json({ error: err });
    }

    req.body = data;
    next();
  };
}

module.exports = inputVerification;
