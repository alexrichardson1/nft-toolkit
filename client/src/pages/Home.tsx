import Box from "@mui/material/Box";
import Form from "components/form/Form";
import { mainContainerStyle } from "utils/constants";

const Home = (): JSX.Element => {
  return (
    <>
      <Box sx={mainContainerStyle}>
        <Form />
      </Box>
    </>
  );
};

export default Home;
