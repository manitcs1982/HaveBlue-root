import React from "react";
import Grid from "@material-ui/core/Grid";
import { useTravelerStyles } from "./TravelerStyles";
import Typography from "@material-ui/core/Typography";
import { ELImageReviewModal } from "../../dataEgress/ELImageReviewModal";
import { DiodeTestModal } from "../../dataEgress/DiodeTestModal";
import { IVReviewModal } from "../../dataEgress/IVReview/IVReviewModal";
import { LeakedDataModal } from "../../dataEgress/LeakedDataModal";
import { VisualInspectionReviewModal } from "../../dataEgress/VisualInspectionReviewModal";
import { formatDate } from "../formatDate";

export const TravelerGroup = ({ data, permissions }: any) => {
  const classes = useTravelerStyles();

  return (
    <>
      <Grid
        item
        xs={2}
        className={classes.baseBorder}
        style={{ backgroundColor: "yellow" }}
      >
        <Typography
          variant="body2"
          align="center"
          style={{ fontWeight: "bold" }}
        >
          {data.linear_execution_group}
        </Typography>
      </Grid>
      <Grid
        item
        xs={10}
        className={classes.baseBorder}
        style={{ backgroundColor: "#eeeeee" }}
      >
        <Typography
          variant="body2"
          align="center"
          style={{ fontWeight: "bold" }}
        >
          {data.name}
        </Typography>
      </Grid>

      {data.procedure_results?.map((procedure: any) => (
        <>
          <Grid item xs={2} className={classes.baseBorder}>
            {procedure.completion_date && procedure.visualizer ? (
              <>
                {permissions ? (
                  <>
                    {procedure.visualizer === "el_image" && (
                      <ELImageReviewModal
                        id={procedure.id}
                        disposition={procedure.disposition_name}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "iv_curve" && (
                      <IVReviewModal
                        id={procedure.id}
                        disposition={procedure.disposition_name}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "wet_leakage" && (
                      <LeakedDataModal
                        id={procedure.id}
                        disposition={procedure.disposition_name}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "visual_inspection" && (
                      <VisualInspectionReviewModal
                        id={procedure.id}
                        disposition={procedure.disposition_name}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "diode" && (
                      <DiodeTestModal
                        id={procedure.id}
                        disposition={procedure.disposition_name}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "stress" && (
                      <Typography variant="body2" align="center">
                        {procedure.procedure_definition_name}
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    {procedure.visualizer === "el_image" && (
                      <ELImageReviewModal
                        id={procedure.id}
                        disposition={null}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "iv_curve" && (
                      <IVReviewModal
                        id={procedure.id}
                        disposition={null}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "wet_leakage" && (
                      <LeakedDataModal
                        id={procedure.id}
                        disposition={null}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "visual_inspection" && (
                      <VisualInspectionReviewModal
                        id={procedure.id}
                        disposition={null}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "diode" && (
                      <DiodeTestModal
                        id={procedure.id}
                        disposition={null}
                        open_notes={procedure.open_notes}
                        has_notes={procedure.has_notes}
                      />
                    )}
                    {procedure.visualizer === "stress" && (
                      <Typography variant="body2" align="center">
                        {procedure.procedure_definition_name}
                      </Typography>
                    )}
                  </>
                )}
              </>
            ) : (
              <Typography variant="body2" align="center">
                {procedure.procedure_definition_name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={2} className={classes.baseBorder}>
            <Typography variant="body2" align="center">
              {procedure.username ? (
                <Typography variant="body2" align="center">
                  {procedure.username}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  align="center"
                  style={{ color: "grey" }}
                >
                  N/A
                </Typography>
              )}
            </Typography>
          </Grid>

          <Grid item xs={2} className={classes.baseBorder}>
            <Typography variant="body2" align="center">
              {procedure.completion_date ? (
                <Typography variant="body2" align="center">
                  {formatDate(procedure.completion_date)}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  align="center"
                  style={{ color: "grey" }}
                >
                  N/A
                </Typography>
              )}
            </Typography>
          </Grid>

          <Grid item xs={2} className={classes.baseBorder}>
            <Typography variant="body2" align="center">
              {procedure.disposition_name ? (
                <Typography variant="body2" align="center">
                  {procedure.disposition_name}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  align="center"
                  style={{ color: "grey" }}
                >
                  N/A
                </Typography>
              )}
            </Typography>
          </Grid>
          <Grid item xs={2} className={classes.baseBorder}>
            <Typography variant="body2" align="center">
              {procedure.reviewed_by_user ? (
                <Typography variant="body2" align="center">
                  {procedure.reviewed_by_user}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  align="center"
                  style={{ color: "grey" }}
                >
                  N/A
                </Typography>
              )}
            </Typography>
          </Grid>
          <Grid item xs={2} className={classes.baseBorder}>
            <Typography variant="body2" align="center">
              {procedure.review_datetime ? (
                <Typography variant="body2" align="center">
                  {formatDate(procedure.review_datetime)}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  align="center"
                  style={{ color: "grey" }}
                >
                  N/A
                </Typography>
              )}
            </Typography>
          </Grid>
        </>
      ))}
    </>
  );
};
