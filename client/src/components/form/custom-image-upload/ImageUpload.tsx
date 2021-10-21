import "./imageUpload.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography } from "@mui/material";

interface PropsT {
  dispatch: React.Dispatch<FormActionI>;
  files: ImageListT;
}

const ImageUpload = ({ files, dispatch }: PropsT): JSX.Element => {
  const numberOfFiles = files.length;

  return (
    <>
      <label
        className="image-upload-label"
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          dispatch({
            type: "CHANGE_IMAGES",
            payload: { images: Array.from(e.dataTransfer.files) },
          });
        }}
        htmlFor="upload-files">
        <CloudUploadIcon
          className="image-upload-cloud"
          color="primary"
          fontSize="large"
        />
        {numberOfFiles > 0 &&
          `Uploaded ${numberOfFiles} file${numberOfFiles === 1 ? "" : "s"}`}
        <Typography align="center" variant="h5">
          Drag and drop your image(s) here
        </Typography>
      </label>
      <input
        onChange={(e) => {
          e.preventDefault();
          dispatch({
            type: "CHANGE_IMAGES",
            payload: { images: Array.from(e.target.files || []) },
          });
        }}
        id="upload-files"
        className="image-upload-input"
        type="file"
        multiple
      />
    </>
  );
};

export default ImageUpload;
