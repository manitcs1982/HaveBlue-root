import { Messaging } from "../../../../../common/enums";
import { stringSanitize } from "../../../../../common/util";
import * as Yup from "yup";

export const useActionCreationFormValues = (
  newValues: any = {},
  newSchema: any = {}
) => {
  const defaultInitialValues = {
    name: "",
    description: "",
    disposition: "",
    action_definition: "",
    execution_group: "",

    promise_datetime: null,
    eta_datetime: null,
    groups: [],
  };
  const defaultSchema = {
    name: Yup.string()
      .required("Field must be required")
      .test("sanitize", Messaging.UserInput, (value: string | undefined) =>
        value ? stringSanitize(value) : false
      ),
    description: Yup.string()
      .required("Field must be required")
      .test("sanitize", Messaging.UserInput, (value: string | undefined) =>
        value ? stringSanitize(value) : false
      ),
    disposition: Yup.string().required("Field must be required"),

    action_definition: Yup.string().required("Field must be required"),
    execution_group: Yup.string().required("Field must be required"),

    promise_datetime: Yup.string()
      .nullable()
      .test(
        "nullCheck",
        Messaging.NullDate,
        (value: string | undefined | null) =>
          value !== undefined && value !== null ? true : false
      ),
    eta_datetime: Yup.string()
      .nullable()
      .test(
        "nullCheck",
        Messaging.NullDate,
        (value: string | undefined | null) =>
          value !== undefined && value !== null ? true : false
      ),
    groups: Yup.array().required("Field must be required"),
  };

  const values = { ...defaultInitialValues, ...newValues };
  const schema = { ...defaultSchema, ...newSchema };

  return { values, schema };
};
