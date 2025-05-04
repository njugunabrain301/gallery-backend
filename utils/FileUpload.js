const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

function UploadToCloud(file, bucketName) {
  let projectId = process.env.G_CLOUD_PROJECT_ID;
  let keyFilename = process.env.G_CLOUD_KEY_FILE;
  const storage = new Storage({
    projectId,
    keyFilename,
  });
  const bucket = storage.bucket(bucketName);

  let func = new Promise((resolve, reject) => {
    try {
      let fileName = Date.now() + "_" + file.originalname;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        resolve(process.env.G_CLOUD_BASE_URL + bucketName + "/" + fileName);
      });
      blobStream.end(file.buffer);
    } catch (err) {
      reject(err);
    }
  });
  return func;
}

function UploadToCloudPromise(file, bucketName) {
  let projectId = process.env.G_CLOUD_PROJECT_ID;
  let keyFilename = process.env.G_CLOUD_KEY_FILE;
  const storage = new Storage({
    projectId,
    keyFilename,
  });
  const bucket = storage.bucket(bucketName);

  return new Promise((resolve, reject) => {
    try {
      let fileName = Date.now() + "_" + file.originalname;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        resolve(process.env.G_CLOUD_BASE_URL + bucketName + "/" + fileName);
      });
      blobStream.end(file.buffer);
    } catch (err) {
      reject(err);
    }
  });
}

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10mb
  },
});

function uploadFile(fileName, fileName2) {
  return async (req, res, next) => {
    let upload = multer.fields([{ name: fileName }, { name: fileName2 }]);
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
        res
          .status(400)
          .send({ error: fileName + " and " + fileName2 + " are required" });
      }

      try {
        if (req.files) {
          UploadToCloud(
            req.files[fileName][0],
            process.env.G_CLOUD_RIDER_PROFILE
          )
            .then((fileURL) => {
              req.body[fileName] = fileURL;
              UploadToCloud(
                req.files[fileName2][0],
                process.env.G_CLOUD_RIDER_PROFILE
              ).then((fileURL2) => {
                req.body[fileName2] = fileURL2;
                next();
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });
        } else {
          res.status(400).send({ error: fileName + " is required" });
        }
      } catch (error) {
        res.status(400).send({ error: error, mess: "yoh" });
      }
    });
  };
}

function uploadSingleFile(fileName, required = true) {
  return async (req, res, next) => {
    let upload = multer.fields([{ name: fileName }]);
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
        res.status(400).send({ error: fileName + " is required" });
      }

      try {
        if (req.files && req.files[fileName]) {
          UploadToCloud(
            req.files[fileName][0],
            process.env.G_CLOUD_RIDER_PROFILE
          )
            .then((fileURL) => {
              req.body[fileName] = fileURL;
              next();
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });
        } else {
          if (!required) {
            req.body[fileName] = "-";
            next();
          } else {
            res
              .status(400)
              .json({ success: false, error: fileName + " is required" });
          }
        }
      } catch (error) {
        console.log(error);
        res.status(400).send({ error: error, mess: "yoh" });
      }
    });
  };
}

function uploadMultipleFiles() {
  return async (req, res, next) => {
    const upload = Multer().any(); // Accept any number of files

    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading files:", err);
        return res.status(400).send({ error: "Error uploading files" });
      }

      try {
        const filesArray = req.files; // Array of uploaded files
        if (!filesArray || filesArray.length === 0) {
          req.body.fileURLs = [];
          next();
        } else {
          const uploadPromises = filesArray.map(async (file) => {
            try {
              const fileURL = await UploadToCloud(
                file,
                process.env.G_CLOUD_RIDER_PROFILE
              );
              return fileURL;
            } catch (error) {
              console.error("Error uploading file to cloud:", error);
              throw error;
            }
          });

          Promise.all(uploadPromises)
            .then((fileURLs) => {
              req.body.fileURLs = fileURLs;
              next();
            })
            .catch((error) => {
              console.error("Error uploading files:", error);
              return res.status(500).send({ error: "Error uploading files" });
            });
        }
      } catch (error) {
        console.error("Error processing files:", error);
        return res.status(400).send({ error: "Error processing files" });
      }
    });
  };
}

module.exports = {
  uploadFile,
  uploadSingleFile,
  uploadMultipleFiles,
};
