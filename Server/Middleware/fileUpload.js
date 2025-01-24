// const { fileUpload } = require("../Helper/index");

// function fileUploadMiddleware({ singleFile = false, multipleFiles = false, multipleFields = false }) {
//   return async function (req, res, next) {
//     req.uploadedFiles = [];

//     // Handle single file upload
//     if (singleFile && req.file) {
//       const { success, publicIdArray } = await fileUpload([req.file]);
//       if (!success) return res.status(500).json({ error: `Error uploading ${req.file.fieldname}, please try again later.` });

//       req.uploadedFiles.push(...publicIdArray);
//       req.body[req.file.fieldname] = publicIdArray[0];
//     }

//     // Handle multiple files upload
//     else if (multipleFiles && req.files && req.files.length) {
//       const { success, publicIdArray } = await fileUpload(req.files);
//       req.uploadedFiles.push(...publicIdArray);
//       if (!success) {
//         res.emit("deleteFiles");
//         return res.status(500).json({ error: "Error uploading files, please try again later." });
//       }

//       req.body[req.files[0].fieldname] = publicIdArray;
//     }

//     //Handle multiple files with multiple fields
//     else if (multipleFields && req.files) {
//       for (const [field, fileArray] of Object.entries(req.files)) {
//         const { success, publicIdArray } = await fileUpload(fileArray);
//         req.uploadedFiles.push(...publicIdArray);
//         if (!success) {
//           res.emit("deleteFiles");
//           return res.status(500).json({ error: "Error uploading files, please try again later." });
//         }
//         req.body[field] = publicIdArray;
//       }
//     }

//     next();
//   };
// }

// module.exports = fileUploadMiddleware;

function fileUploadMiddleware({ singleFile = false, multipleFiles = false, multipleFields = false }) {
  return async function (req, res, next) {
    req.uploadedFiles = [];

    // Handle single file upload
    if (singleFile && req.file) {
      req.uploadedFiles.push(req.file.filename);
      req.body[req.file.fieldname] = req.file.filename;
    }

    // Handle multiple files upload
    else if (multipleFiles && req.files && req.files.length) {
      req.body[req.files[0].fieldname] = req.files.map((file) => file.filename);
      req.uploadedFiles.push(...req.body[req.files[0].fieldname]);
    }

    //Handle multiple files with multiple fields
    else if (multipleFields && req.files) {
      for (const [field, fileArray] of Object.entries(req.files)) {
        const publicIdArray = req.files[field].map((file) => file.filename);
        req.uploadedFiles.push(...(publicIdArray || []));
        req.body[field] = publicIdArray;
      }
    }
    next();
  };
}

module.exports = fileUploadMiddleware;
