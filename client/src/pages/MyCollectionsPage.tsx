import Stack from "@mui/material/Stack";
import PageHeader from "components/common/PageHeader";
import { useParams } from "react-router-dom";

interface ParamsI {
  address: string;
}

const MyCollectionsPage = (): JSX.Element => {
  const { address } = useParams<ParamsI>();
  return (
    <Stack>
      <PageHeader text={`${address}'s Collection`} />
    </Stack>
  );
};

export default MyCollectionsPage;
