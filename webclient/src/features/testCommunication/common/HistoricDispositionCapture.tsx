import { TextField, MenuItem } from "@material-ui/core";

export const HistoricDispositionCapture = ({
  dispositions,
  setHistoricDisposition,
}: any) => {
  return (
    <TextField
      id="historicDisposition"
      type="text"
      data-testid="historicDisposition"
      name="historicDisposition"
      select={true}
      label="Pick a disposition"
      fullWidth
    >
      {dispositions?.map((disposition: any) => (
        <MenuItem
          key={disposition.id}
          value={disposition.url}
          onClick={() => setHistoricDisposition(disposition)}
        >
          {disposition.name}
        </MenuItem>
      ))}
    </TextField>
  );
};
