import multer from "multer";

export const uploadImagesLocal = multer({ dest: "uploads/" }).any();
