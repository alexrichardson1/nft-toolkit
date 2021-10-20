import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Navbar from "components/common/Navbar";
import Form from "components/form/Form";
import { mainContainerStyle } from "utils/constants";

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
