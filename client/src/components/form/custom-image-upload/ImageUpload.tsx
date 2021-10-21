import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography } from "@mui/material";
import "./imageUpload.css";

interface PropsT {
  files: ImageListT;
  handleImageDrop: (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    files: FileList | null
  ) => void;
}

const ImageUpload = ({ files, handleImageDrop }: PropsT): JSX.Element => {
  const numberOfFiles = files.length;
  const preventDefault = (e: React.DragEvent<HTMLLabelElement>) =>
    e.preventDefault();

  return (
    <>
      <label
        className="image-upload-label"
        onDragOver={preventDefault}
        onDragLeave={preventDefault}
        onDragEnter={preventDefault}
        onDrop={(e) => handleImageDrop(e, e.dataTransfer.files)}
        htmlFor="upload-files">
        <CloudUploadIcon
          className="image-upload-cloud"
          color="primary"
          fontSize="large"
        />
        {numberOfFiles > 0 &&
          `Uploaded ${numberOfFiles} file${numberOfFiles === 1 ? "" : "s"}`}
        <Typography align="center" variant="h5">
          Upload your NFT collection image(s) here
        </Typography>
      </label>

      <input
        onChange={(e) => handleImageDrop(e, e.target.files)}
        id="upload-files"
        className="image-upload-input"
        type="file"
        multiple
      />
    </>
  );
};

export default ImageUpload;
