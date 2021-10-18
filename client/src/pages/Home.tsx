import Divider from "@mui/material/Divider";
import Navbar from "components/common/Navbar";
import Controls from "components/form/controls/Controls";

const Home = (): JSX.Element => {
  return (
    <>
      <Navbar />
      <Divider />
      <Controls />
    </>
  );
};

export default Home;
