import React from "react";
import {
  Typography,
  Grid,
  useTheme,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardHeader,
  Button,
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import { useHistory, useParams } from "react-router-dom";
import { CallMade, EditLocationRounded } from "@material-ui/icons";
import { motion, Variants } from "framer-motion";
import { useNoteCounts } from "../../../projectQueries";
import { CardLoader } from "../../../../common/CardLoader";
import { ErrorMessage } from "../../../../common/ErrorMessage";

export const TestResultFlagsAndThreadedResponsesCard = ({ notes }: any) => {
  const theme = useTheme();
  const history = useHistory();

  const variants: Variants = {
    initialFlagButton: {
      background: "#ffe5e5",
      opacity: 1,
    },
    animateFlagButton: {
      background: "#ffb2b2",
      opacity: 0.3,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const renderCardContent = () => {
    return (
      <>
        <CardHeader
          style={theme.cardHeader}
          subheader={
            <Typography variant="subtitle1" style={theme.dashboardCardTitle}>
              Test Result Flags and Threaded Responses
            </Typography>
          }
          action={
            <IconButton
              onClick={() => history.push(`${history.location.pathname}/flags`)}
            >
              <CallMade style={theme.cardGoToDetailButton} />
            </IconButton>
          }
        ></CardHeader>
        <CardContent>
          {notes.length > 0 ? (
            <TableContainer>
              <Table
                size="small"
                padding="none"
                style={{ minWidth: 20 }}
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Unread</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Closed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notes.map((noteCount: any) => {
                    if (noteCount.type_name.includes("Flag")) {
                      return (
                        <TableRow
                          key={1}
                          component={motion.tr}
                          variants={variants}
                          initial="initialFlagButton"
                          animate="animateFlagButton"
                        >
                          <TableCell>{noteCount.type_name}</TableCell>
                          <TableCell>{noteCount.unread_count}</TableCell>
                          <TableCell>{noteCount.active_count}</TableCell>
                          <TableCell>{noteCount.closed_count}</TableCell>
                        </TableRow>
                      );
                    }
                    return (
                      <TableRow key={1}>
                        <TableCell>{noteCount.type_name}</TableCell>
                        <TableCell>{noteCount.unread_count}</TableCell>
                        <TableCell>{noteCount.active_count}</TableCell>
                        <TableCell>{noteCount.closed_count}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={4}
            >
              <Grid item xs={12}>
                <Typography variant="body2">
                  No notes,flags and intake directives available
                </Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </>
    );
  };

  return <Card style={theme.dashboardCard}>{renderCardContent()}</Card>;
};
