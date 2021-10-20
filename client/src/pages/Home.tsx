import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { mainContainerStyle } from "common/constants";
import Navbar from "components/common/Navbar";
import Form from "components/form/Form";

const Home = (): JSX.Element => {
  return (
    <>
      <Navbar />
      <Divider />
      <Box sx={mainContainerStyle}>
        <Form />
      </Box>
    </>
  );
};

export default Home;
