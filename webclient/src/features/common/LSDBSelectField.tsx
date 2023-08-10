import { InputLabel, MenuItem } from "@material-ui/core";
import { Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { Select } from "formik-material-ui";

const useStyles = makeStyles({
  errorSelect: {
    color: "red",
  },
});

/**
 * This component abstracts the error displaying for a select as a Formik Field
 *
 * @param {Object} props - The properties of this component
 * @param {string} props.fieldId - The ID to be used by the field, the one you'd use in validation and submission.
 * @param {string} props.fieldName - The name to be used by the field.
 * @param {string} props.fieldDisplayName - The name to be displayed in the selector, as well as in the Label
 * @param {*} props.errors - The errors object for this field, identified as errors."id"
 * @param {Type[] | undefined} props.options - The options for this Select field
 * @param props.mappingFunction - The function to map every option provided, this needs to return a MenuItem Component. If the options object gets interpreted as being of unknown type, you need to type the option as any
 */
function LSDBSelectField<Type>({
  fieldId,
  fieldName,
  fieldDisplayName,
  fullWidth,
  errors,
  options,
  mappingFunction,
}: {
  fieldId: string;
  fieldName: string;
  fieldDisplayName: string;
  fullWidth: boolean;
  errors: any;
  options: Type[] | undefined;
  mappingFunction: (objectToMap: Type) => JSX.Element;
}) {
  const classes = useStyles();

  return (
    <div style={{ paddingBottom: 32 }}>
      <InputLabel htmlFor={fieldId}>{fieldDisplayName}</InputLabel>
      <Field
        id={fieldId}
        name={fieldName}
        fullWidth={fullWidth}
        className={errors && classes.errorSelect}
        component={Select}
      >
        <MenuItem value={0}> Select a {fieldDisplayName}</MenuItem>

        {options && options.map(mappingFunction)}
      </Field>

      {errors && <div className={classes.errorSelect}>{errors}</div>}
    </div>
  );
}

export default LSDBSelectField;
