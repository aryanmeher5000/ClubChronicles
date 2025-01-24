const { fileDelete } = require("../Helper/index");

function fileDeleteMiddleware(req, res, next) {
  res.on("deleteFiles", async ({ success = false }) => {
    if (!success && req?.uploadedFiles.length > 0)
      req.deletableFiles = [...(req?.deletableFiles || []), ...(req?.uploadedFiles || [])];
    if (req?.deletableFiles?.length > 0) await fileDelete(req.deletableFiles);
  });
  next();
}

module.exports = fileDeleteMiddleware;
