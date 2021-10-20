import "./imageUpload.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography } from "@mui/material";

interface PropsT {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const ImageUpload = ({ setFiles }: PropsT): JSX.Element => {
  return (
    <>
      <label
        className="image-upload-label"
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
        }}
        htmlFor="upload-files">
        <CloudUploadIcon
          className="image-upload-cloud"
          color="primary"
          fontSize="large"
        />
        <Typography variant="h5">Drag and drop your images here</Typography>
      </label>
      <input
        onChange={(e) => {
          e.preventDefault();
          setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
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
