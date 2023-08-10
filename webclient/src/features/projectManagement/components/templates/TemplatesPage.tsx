import { useTemplates } from "../../adminQueries";
import GenericModelList from "../../../common/GenericModelList";
import React from "react";
import IdButton from "../../../common/IdButton";
import { LinearProgress } from "@material-ui/core";
import { ErrorMessage } from "../../../common/ErrorMessage";

const TemplatesPage = () => {
  /*const templates: any[] = [
    {
      id: 1,
      name: "Test Template",
      disposition: "Available",
      format: "html",
      description: "only a test template to see how this would look",
    },
  ];*/

  const templatesQuery = useTemplates();

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }: any) => (
          <IdButton path={`templates/${row.values.id}`} id={row.values.id} />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Disposition",
        accessor: "disposition",
      },
      {
        Header: "Format",
        accessor: "format",
      },
      {
        Header: "Description",
        accessor: "description",
      },
    ],
    []
  );

  if (templatesQuery.isLoading) {
    return <LinearProgress />;
  }

  if (templatesQuery.isError) {
    return <ErrorMessage error={templatesQuery.error} />;
  }

  return (
    <GenericModelList
      newModelObjectPath="templates/new_template"
      modelName="Template"
      columns={columns}
      modelData={templatesQuery.data}
    />
  );
};

export default TemplatesPage;
