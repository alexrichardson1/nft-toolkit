import { Typography } from "@mui/material";

const ERROR_MESSAGE = "Error! This page does not exist";

const Error404Page = (): JSX.Element => {
  return (
    <>
      <Typography align="center" variant="h1" fontSize="10rem">
        <b>404</b>
      </Typography>
      <Typography align="center" variant="h2">
        {ERROR_MESSAGE}
      </Typography>
    </>
  );
};

export default Error404Page;
