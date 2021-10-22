import { AlertColor } from "@mui/material/Alert";

const showAlert = (
  setSeverity: (value: React.SetStateAction<AlertColor>) => void,
  type: AlertColor,
  setMessage: (value: React.SetStateAction<string>) => void,
  message: string
): void => {
  setSeverity(type);
  setMessage(message);
};

export default showAlert;
