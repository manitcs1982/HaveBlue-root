import React from "react";
import { Grid, Typography, TextField, CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PrintIcon from '@material-ui/icons/Print';
import printJS from "print-js";

import { useMagicLink, useLabel } from "../../intakeQueries";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { getBaseUrl } from "../../../common/util";

export const LabelButton = ({ unitID, token } : any) => {

  const {
    error: errorLink,
    data: link,
    isLoading: isLoadingLink,
    isError: isErrorLink,
    isSuccess: isSuccessLink,
  } = useMagicLink(unitID);

  const printLabel = async () => {
    printJS({printable: `${getBaseUrl()}/units/${unitID}/get_label/?token=${link.token}`, type: "pdf"});
  }

  if (isErrorLink) {
    return (
      <>
        <ErrorMessage error={errorLink} />
      </>
    );
  }

  if (isLoadingLink) {
    <Button
      variant="contained"
      disabled
    >
      <CircularProgress/>
    </Button>
  }



  return (
    <Button
      variant="contained"
      startIcon={<PrintIcon />}
      onClick={printLabel}
    />
  )
}
