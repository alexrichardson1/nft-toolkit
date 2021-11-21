import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Theme, Typography, useTheme } from "@mui/material";
import "./imageUpload.css";

const labelStyle = (theme: Theme) => ({
  borderRadius: theme.shape.borderRadius,
  borderColor: theme.palette.primary.main,
  boxShadow: theme.shadows[2],
});
interface PropsT {
  NUMBER_OF_IMAGES: number;
  handleImageDrop: (
    e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
    imgObjs: FileList | null
  ) => void;
}

const ImageUpload = ({
  NUMBER_OF_IMAGES,
  handleImageDrop,
}: PropsT): JSX.Element => {
  const theme = useTheme();

  const preventDefault = (e: React.DragEvent<HTMLLabelElement>) =>
    e.preventDefault();

  const UPLOAD_INPUT_ID = "upload-images";

  return (
    <>
      <label
        tabIndex={0}
        style={labelStyle(theme)}
        className="img-upload-label"
        onDragOver={preventDefault}
        onDragLeave={preventDefault}
        onDragEnter={preventDefault}
        onDrop={(e) => handleImageDrop(e, e.dataTransfer.files)}
        htmlFor={UPLOAD_INPUT_ID}
        data-testid="img-upload-label">
        <CloudUploadIcon
          className="img-upload-cloud"
          color="primary"
          fontSize="large"
        />
        {NUMBER_OF_IMAGES > 0 && `Uploaded ${NUMBER_OF_IMAGES} image(s)`}
        <Typography align="center" variant="h5">
          Upload your NFT collection image(s) here
        </Typography>
      </label>

      <input
        accept="image/*"
        onChange={(e) => handleImageDrop(e, e.target.files)}
        id={UPLOAD_INPUT_ID}
        className="img-upload-input"
        type="file"
        data-testid="img-upload-input"
        multiple
      />
    </>
  );
};

export default ImageUpload;
