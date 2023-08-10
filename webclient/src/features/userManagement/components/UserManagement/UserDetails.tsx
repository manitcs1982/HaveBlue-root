import { useParams } from "react-router";
import { Container, Grid, ListItemText, Typography } from "@material-ui/core";

import { useAvailableGroups, useUserDetails } from "../../userQueries";
import { toast } from "react-toastify";
import React from "react";
import { ServerGroup } from "../../types/Group";
import UserForm from "./UserForm";
import User from "../../types/User";
import RelationshipPicker from "./RelationshipPicker";
import { useTemplates } from "../../../projectManagement/adminQueries";
import {
  ServerTemplate,
  UserProfileTemplate,
} from "../../../projectManagement/types/Template";
import {
  useSetUserAllowedTemplates,
  useSetUserGroups,
  useUpdateUser,
} from "../../userMutations";

export const UserDetails = () => {
  let { userId } = useParams() as { userId: string };

  const userDetailsQuery = useUserDetails(userId);
  const availableGroupsQuery = useAvailableGroups();
  const templatesQuery = useTemplates();

  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: setUserGroups } = useSetUserGroups();
  const { mutateAsync: setUserAllowedTemplates } = useSetUserAllowedTemplates();

  const [assignedGroups, setAssignedGroups] = React.useState<ServerGroup[]>([]);
  const [availableGroups, setAvailableGroups] = React.useState<ServerGroup[]>(
    []
  );

  const [assignedTemplates, setAssignedTemplates] = React.useState<
    ServerTemplate[]
  >([]);
  const [availableTemplates, setAvailableTemplates] = React.useState<
    ServerTemplate[]
  >([]);

  let assignedGroupsIds: number[] = React.useMemo(() => {
    if (userDetailsQuery.data !== undefined)
      return userDetailsQuery.data.groups || [];
  }, [userDetailsQuery.data]);

  let assignedTemplatesArray: UserProfileTemplate[] = React.useMemo(() => {
    if (userDetailsQuery.isSuccess) {
      return userDetailsQuery.data.userprofile.allowed_templates;
    }

    return [];
  }, [userDetailsQuery.isSuccess, userDetailsQuery.data]);

  const isTemplateAssigned = (template: ServerTemplate): boolean =>
    assignedTemplatesArray.some(
      (assignedTemplate) => assignedTemplate.id === template.id
    );

  React.useEffect(() => {
    if (availableGroupsQuery.data !== undefined) {
      setAvailableGroups(
        availableGroupsQuery.data.filter((group) => {
          if (group.id !== undefined && assignedGroupsIds !== undefined)
            return !assignedGroupsIds.includes(group.id);
          return false;
        })
      );
      setAssignedGroups(
        availableGroupsQuery.data.filter((group) => {
          if (group.id !== undefined && assignedGroupsIds !== undefined)
            return assignedGroupsIds.includes(group.id);
          return false;
        })
      );
    }
  }, [availableGroupsQuery.data, assignedGroupsIds]);

  React.useEffect(() => {
    if (templatesQuery.isSuccess && templatesQuery.data.length > 0) {
      setAvailableTemplates(
        templatesQuery.data.filter((template) => !isTemplateAssigned(template))
      );

      setAssignedTemplates(
        templatesQuery.data.filter((template) => isTemplateAssigned(template))
      );
    }
  }, [templatesQuery.isSuccess, templatesQuery.data]);

  return (
    <Container>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3">User Details</Typography>
        </Grid>
      </Grid>
      {userDetailsQuery.isSuccess && (
        <>
          <UserForm
            initialValues={{
              ...userDetailsQuery.data,
              ...userDetailsQuery.data.userprofile,
              password: "",
            }}
            submitForm={async (values) => {
              const { password, ...updatedUser } = values;

              const user: User = {
                date_joined: updatedUser.date_joined,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                id: updatedUser.id,
                is_active: updatedUser.is_active,
                is_staff: updatedUser.is_staff,
                is_superuser: updatedUser.is_superuser,
                last_name: updatedUser.last_name,
                username: updatedUser.username,
                userprofile: {
                  notes: updatedUser.notes,
                  registration_comment: updatedUser.registration_comment,
                  administration_comment: updatedUser.administration_comment,
                  user_registration_status:
                    updatedUser.user_registration_status,
                  email_subscriptions: updatedUser.email_subscriptions,
                },
              };

              if (password !== "") user.password = password;

              try {
                await updateUser(
                  { id: "" + user.id, updatedUser: user },
                  {
                    onSuccess: () => {
                      toast.success("User updated successfully!");
                      values.password = "";
                    },
                  }
                );
              } catch (err) {
                toast.error("Error while updating user");
              }
            }}
            isDetailView={true}
          />

          <br />

          {availableGroupsQuery.isSuccess && (
            <RelationshipPicker
              pickerTitle="User Groups"
              assignedItemsTitle="Assigned Groups"
              availableItemsTitle="Available Groups"
              assignedItems={assignedGroups}
              setAssignedItems={setAssignedGroups}
              availableItems={availableGroups}
              setAvailableItems={setAvailableGroups}
              renderAssignedItem={(item) => (
                <ListItemText primary={item.name} />
              )}
              renderAvailableItem={(item) => (
                <ListItemText primary={item.name} />
              )}
              saveAssignedItems={async (assignedItems) => {
                try {
                  await setUserGroups({
                    userId: +userId,
                    groupsIds: assignedItems.map(
                      (assignedItem) => assignedItem.id || 1
                    ),
                  });
                  toast.success("Success updating user groups");
                } catch (error) {
                  toast.error("Error updating user groups");
                }
              }}
            />
          )}

          <br />

          {templatesQuery.isSuccess && (
            <RelationshipPicker
              pickerTitle="Template Subscription"
              assignedItemsTitle="Allowed Templates"
              availableItemsTitle="Available Templates"
              assignedItems={assignedTemplates}
              setAssignedItems={setAssignedTemplates}
              availableItems={availableTemplates}
              setAvailableItems={setAvailableTemplates}
              renderAssignedItem={(item) => (
                <ListItemText primary={item.name} />
              )}
              renderAvailableItem={(item) => (
                <ListItemText primary={item.name} />
              )}
              saveAssignedItems={async (assignedItems) => {
                try {
                  await setUserAllowedTemplates(
                    {
                      userId: +userId,
                      templatesIds: assignedItems.map(
                        (assignedItem) => assignedItem.id
                      ),
                    },
                    {
                      onSuccess: () => {
                        toast.success("Successfully updated allowed templates");
                      },
                    }
                  );
                } catch (e) {
                  toast.error("Error while updating allowed templates");
                }
              }}
            />
          )}
        </>
      )}
    </Container>
  );
};
