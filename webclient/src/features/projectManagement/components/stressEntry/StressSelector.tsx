import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { useTheme } from "@material-ui/core";

export const StressSelector = ({
  stresses,
  onStressSelection,
  selectedStressType,
}: any) => {
  const theme = useTheme();

  return (
    <div style={theme.container}>
      <FormControl
        style={{
          minWidth: 200,
        }}
      >
        <InputLabel id="demo-simple-select-helper-label">
          Select asset
        </InputLabel>
        <Select
          disabled={selectedStressType}
          variant="filled"
          defaultValue={0}
          value={selectedStressType?.id ? selectedStressType.id : 0}
        >
          <MenuItem value={0}>
            <em>None</em>
          </MenuItem>
          {stresses.map((stressType: any) => (
            <MenuItem
              value={stressType.id}
              onClick={() => onStressSelection(stressType)}
            >
              {stressType.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
