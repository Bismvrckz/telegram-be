async function sendBotImage(req, res, next) {
  try {
    const { chat_id } = req.params;
    req.image_storage_id = `${new Date().getTime()}-${chat_id}`;
    next();
  } catch (error) {
    next(error);
  }
}

async function sendBotDocument(req, res, next) {
  try {
    const { chat_id } = req.params;
    req.file_storage_id = `document-${new Date().getTime()}-${chat_id}`;
    console.log(req.file_storage_id);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { sendBotImage, sendBotDocument };
