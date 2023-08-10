import { QueryClientProvider } from "./QueryClientProvider";
import { ThemeProvider } from "@material-ui/core/styles";
import { AuthProvider } from "./features/common/AuthContext";
import { FetchContextProvider } from "./features/common/FetchContext";
import { CustomerDetailsContextProvider } from "./features/common/CustomerDetailsContext";
import { VisualInspectionDetailsContextProvider } from "./features/common/VisualInspectionContext";
import { ErrorHandlingContextProvider } from "./features/common/ErrorHandlingContext";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { LSDBTheme } from "./themes/LSDBTheme";
import { ToastContainer } from "react-toastify";
import MomentUtils from "@date-io/moment";

export const AppProviders = ({ children }: any) => {
  return (
    <ThemeProvider theme={LSDBTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ToastContainer />
        <QueryClientProvider>
          <AuthProvider>
            <FetchContextProvider>
              <CustomerDetailsContextProvider>
                <VisualInspectionDetailsContextProvider>
                  <ErrorHandlingContextProvider>
                    {children}
                  </ErrorHandlingContextProvider>
                </VisualInspectionDetailsContextProvider>
              </CustomerDetailsContextProvider>
            </FetchContextProvider>
          </AuthProvider>
        </QueryClientProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};
