import Typography from "@mui/material/Typography";

interface PropsT {
  text: string;
}

const PageHeader = ({ text }: PropsT) => {
  return (
    <Typography
      variant="h4"
      noWrap
      component="div"
      color="secondary"
      textAlign="center">
      {text}
    </Typography>
  );
};

export default PageHeader;
