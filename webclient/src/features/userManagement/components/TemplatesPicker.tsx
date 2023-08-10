import React from "react";
import RelationshipPicker from "./UserManagement/RelationshipPicker";
import {
  ServerTemplate,
  UserProfileTemplate,
} from "../../projectManagement/types/Template";
import { ListItemText } from "@material-ui/core";
import { useSetUserAllowedTemplates } from "../userMutations";
import { toast } from "react-toastify";
import { useTemplates } from "../../projectManagement/adminQueries";
import { ErrorMessage } from "../../common/ErrorMessage";

export const TemplatesPicker = ({
  userId,
  assignedTemplatesIds,
}: {
  userId: number;
  assignedTemplatesIds: number[];
}) => {
  const templates = useTemplates();

  const { mutateAsync: setAllowedTemplates } = useSetUserAllowedTemplates();

  const [assignedTemplates, setAssignedTemplates] = React.useState<
    ServerTemplate[]
  >([]);
  const [availableTemplates, setAvailableTemplates] = React.useState<
    ServerTemplate[]
  >([]);

  const isTemplateAssigned = (template: ServerTemplate): boolean =>
    assignedTemplatesIds.some(
      (assignedTemplateId) => assignedTemplateId === template.id
    );

  React.useEffect(() => {
    if (templates.isSuccess && templates.data.length > 0) {
      setAvailableTemplates(
        templates.data.filter((template) => !isTemplateAssigned(template))
      );

      setAssignedTemplates(
        templates.data.filter((template) => isTemplateAssigned(template))
      );
    }
  }, [templates.data, templates.isSuccess]);

  return (
    <>
      {templates.isSuccess ? (
        <RelationshipPicker
          pickerTitle="Template Subscription"
          assignedItemsTitle="Allowed Templates"
          availableItemsTitle="Available Templates"
          assignedItems={assignedTemplates}
          setAssignedItems={setAssignedTemplates}
          availableItems={availableTemplates}
          setAvailableItems={setAvailableTemplates}
          renderAssignedItem={(template) => (
            <ListItemText primary={template.name} />
          )}
          renderAvailableItem={(template) => (
            <ListItemText primary={template.name} />
          )}
          saveAssignedItems={async (assignedTemplates) => {
            try {
              await setAllowedTemplates(
                {
                  userId,
                  templatesIds: assignedTemplates.map(
                    (assignedTemplate) => assignedTemplate.id
                  ),
                },
                {
                  onSuccess: () => {
                    toast.success(
                      "Successfully updated your allowed templates"
                    );
                  },
                }
              );
            } catch (e) {
              toast.error("Error while updating allowed templates");
            }
          }}
        />
      ) : (
        <ErrorMessage error={templates.error} />
      )}
    </>
  );
};
