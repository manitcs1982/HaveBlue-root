import * as React from "react";
import { QueryClient, QueryClientProvider as RQProvider } from "react-query";

const useConstant = (initializer: any) => {
  return React.useState(initializer)[0];
};

export const QueryClientProvider = ({ children }: any) => {
  const queryClient = useConstant(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
        mutations: {
          onError: (err, variables, recover) =>
            typeof recover === "function" ? recover() : null,
        },
      },
    });

    return client;
  });
  return <RQProvider client={queryClient}>{children}</RQProvider>;
};
