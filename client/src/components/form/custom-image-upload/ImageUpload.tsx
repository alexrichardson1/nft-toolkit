import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography, useTheme } from "@mui/material";
import "./imageUpload.css";

interface PropsT {
  imgObjs: ImageListT;
  handleImageDrop: (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null
  ) => void;
}

const ImageUpload = ({ imgObjs, handleImageDrop }: PropsT): JSX.Element => {
  const numberOfImages = imgObjs.length;
  const theme = useTheme();

  const preventDefault = (e: React.DragEvent<HTMLLabelElement>) =>
    e.preventDefault();

  const labelStyle = {
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.primary.main,
  };

  return (
    <>
      <label
        tabIndex={0}
        style={labelStyle}
        className="img-upload-label"
        onDragOver={preventDefault}
        onDragLeave={preventDefault}
        onDragEnter={preventDefault}
        onDrop={(e) => handleImageDrop(e, e.dataTransfer.files)}
        htmlFor="upload-images">
        <CloudUploadIcon
          className="img-upload-cloud"
          color="primary"
          fontSize="large"
        />
        {numberOfImages > 0 &&
          `Uploaded ${numberOfImages} image${numberOfImages === 1 ? "" : "s"}`}
        <Typography align="center" variant="h5">
          Upload your NFT collection image(s) here
        </Typography>
      </label>

      <input
        accept="image/*"
        onChange={(e) => handleImageDrop(e, e.target.files)}
        id="upload-images"
        className="img-upload-input"
        type="file"
        multiple
      />
    </>
  );
};

export default ImageUpload;
