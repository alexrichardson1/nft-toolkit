import Typography from "@mui/material/Typography";
import { pure } from "recompose";

interface PropsT {
  text: string;
}

const PageHeader = ({ text }: PropsT): JSX.Element => {
  return (
    <Typography
      gutterBottom
      variant="h4"
      noWrap
      component="div"
      color="secondary"
      textAlign="center">
      {text}
    </Typography>
  );
};

export default pure(PageHeader);
