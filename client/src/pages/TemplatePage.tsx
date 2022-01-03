import { Box, Collapse, Stack, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { PageNumbers } from "components/common/PageNumbers";
import { useEffect, useState } from "react";

interface PropsT<T> {
  title: string;
  address: string;
  data: T[];
  dummyData: T[];
  Component: ({ page, data }: { page: number; data: T[] }) => JSX.Element;
}

const textStyle: SxProps = {
  textTransform: "uppercase",
  overflowWrap: "break-word",
};

const TemplatePage = <T extends unknown>({
  title,
  address,
  data,
  dummyData,
  Component,
}: PropsT<T>): JSX.Element => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <Box flexGrow={1} display="flex">
      <Collapse sx={{ width: 1 }} in={data !== dummyData}>
        <Stack spacing={2} justifyContent="center">
          <Box display="flex" flexDirection="column">
            <Typography
              textAlign="center"
              sx={textStyle}
              variant="h3"
              color="secondary">
              {title}
            </Typography>
            <Typography textAlign="center" sx={textStyle} color="primary">
              {address}
            </Typography>
          </Box>
          <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
            <Component page={page} data={data} />
          </Box>
          <PageNumbers
            page={page}
            setPage={setPage}
            arrayLength={data.length}
          />
        </Stack>
      </Collapse>
    </Box>
  );
};

export default TemplatePage;
