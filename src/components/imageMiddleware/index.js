async function sendBotImage(req, res, next) {
  try {
    const { chat_id } = req.params;
    const image_id = `${new Date().getTime()}-${chat_id}`;
    console.log({ image_id });
    req.image_id = image_id;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { sendBotImage };
