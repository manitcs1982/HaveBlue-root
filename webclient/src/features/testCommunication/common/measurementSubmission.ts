import React from "react";
import moment from "moment";
import { Disposition } from "../../common/types/disposition.type";
import { collapseToast, toast } from "react-toastify";
import { processErrorOnMutation } from "../../../util/errorMessaging";
import { Auth } from "../../common/AuthContext";
import { AxiosInstance } from "axios";
import { UseMutateAsyncFunction } from "react-query";
import TesterTypes from "./TesterTypes";
import find from "lodash/find";
import { VisualInspectionDetails } from "../../common/VisualInspectionContext";

type Action =
  | { type: "LOGIN_PENDING" }
  | { type: "LOGIN_SUCCESS"; payload: Auth }
  | { type: "LOGIN_REJECTED"; payload: any }
  | { type: "LOGOUT" }
  | { type: "REFRESH_LOGIN" }
  | { type: "REFRESH_TOKEN"; payload: { token: string } };

const noDefectSubmission = async (
  authAxios: AxiosInstance,
  procedureResultData: any,
  dispositionRequiresReview: Disposition | undefined,
  assetData: any,
  inspectModule: any,
  startDateTime: any,
  endDateTime: string,
  historicData: any,
  historicDate: any,
  historicUser: any,
  historicDisposition: any,
  mutateSubmitMeasurementResult: UseMutateAsyncFunction<any, any, any, any>,
  mutateSubmitStepResult: UseMutateAsyncFunction<any, any, any, any>,
  mutateSubmitProcedureResult: UseMutateAsyncFunction<any, any, any>
) => {
  toast.info("Submitting inspect module measurement results");

  // Non Historic
  let inspectModuleObject: any = {
    authAxios,
    disposition: dispositionRequiresReview?.id,
    result_boolean: true,
    asset: assetData.id,
    measurementResultId: inspectModule.measurement_results[0].id,
    start_datetime: startDateTime,
  };

  // HISTORIC
  if (
    historicData &&
    historicDate &&
    historicUser &&
    historicDisposition &&
    assetData
  ) {
    const { start_datetime, ...temp } = inspectModuleObject;
    inspectModuleObject = {
      ...temp,
      start_datetime: startDateTime,
      user: historicUser.id,
      datetime: historicDate,
      historic: true,
      disposition: historicDisposition.id,
    };
  }
  console.log(inspectModuleObject);
  await mutateSubmitMeasurementResult(inspectModuleObject);

  toast.info("Submitting inspect module step result");

  const startDateTimeStepResult = historicData
    ? procedureResultData.start_datetime
    : startDateTime;

  await mutateSubmitStepResult({
    authAxios,
    disposition: dispositionRequiresReview?.id,
    stepResultId: inspectModule.id,
    start_datetime: startDateTimeStepResult,
  });

  toast.info("Submiting inspect module procedure result ");
  //Submit Procedure Result with disposition
  if (
    historicData &&
    historicDate &&
    historicUser &&
    historicDisposition &&
    assetData
  ) {
    //HISTORIC
    await mutateSubmitProcedureResult({
      authAxios,
      disposition: historicDisposition?.id,
      procedureResultId: procedureResultData.id,
    });
  } else {
    //NON HISTORIC
    await mutateSubmitProcedureResult({
      authAxios,
      disposition: dispositionRequiresReview?.id,
      procedureResultId: procedureResultData.id,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
    });
  }
};

const defectSubmission = async (
  endDateTime: string,
  procedureResultData: any,
  authAxios: AxiosInstance,
  dispositionRequiresReview: Disposition | undefined,
  assetData: any,
  inspectModule: any,
  startDateTime: any,
  historicData: any,
  historicDate: any,
  historicUser: any,
  historicDisposition: any,
  mutateSubmitMeasurementResult: UseMutateAsyncFunction<any, any, any, any>,
  mutateSubmitStepResult: UseMutateAsyncFunction<any, any, any, any>,
  visualInspectionDetailsState: VisualInspectionDetails,
  mutateAddStepToProcedure: UseMutateAsyncFunction<any, any, any, any>,
  mutatePostFile: UseMutateAsyncFunction<any, any, any, any>,
  mutateLinkFileToMeasurement: UseMutateAsyncFunction<any, any, any, any>,
  mutateSubmitProcedureResult: UseMutateAsyncFunction<any, any, any, any>
) => {
  const recordVisualDefect = find(procedureResultData.step_results, [
    "name",
    "Record Visual Defect",
  ]);

  toast.info("Submitting inspect module measurement");

  // Non Historic
  let inspectModuleObject: any = {
    authAxios,
    disposition: dispositionRequiresReview?.id,
    result_boolean: false,
    asset: assetData.id,
    measurementResultId: inspectModule.measurement_results[0].id,
    start_datetime: startDateTime,
  };

  //HISTORIC
  if (
    historicData &&
    historicDate &&
    historicUser &&
    historicDisposition &&
    assetData
  ) {
    const { start_datetime, ...temp } = inspectModuleObject;
    inspectModuleObject = {
      ...temp,
      user: historicUser.id,
      start_datetime: historicDate,
      historic: true,
      disposition: historicDisposition.id,
    };
  }
  await mutateSubmitMeasurementResult(inspectModuleObject);
  toast.info("Submitting step result measurements");

  const startDateTimeStepResult = historicData
    ? procedureResultData.start_dastetime
    : startDateTime;
  // Submit Inspect Module Step Result with disposition
  await mutateSubmitStepResult({
    authAxios,
    disposition: dispositionRequiresReview?.id,
    stepResultId: inspectModule.id,
    start_datetime: startDateTimeStepResult,
  });

  // For each defect
  let counter = 0;
  let visualInspectionDefectMeasurementResult = null;
  let visualInspectionObservationMeasurementResult = null;
  let visualInspectionPhotoMeasurementResult = null;

  for (let key of visualInspectionDetailsState.defects.keys()) {
    // Add a new step with the definition,execution,disposition and date that the Record Visual Step Result has
    if (counter === 0) {
      // Look for Visual Inspection Defect,Visual Inspection Observation and Visual Inspection Photo
      visualInspectionDefectMeasurementResult = find(
        recordVisualDefect.measurement_results,
        ["name", "Visual Inspection Defect"]
      );
      visualInspectionObservationMeasurementResult = find(
        recordVisualDefect.measurement_results,
        ["name", "Visual Inspection Observation"]
      );
      visualInspectionPhotoMeasurementResult = find(
        recordVisualDefect.measurement_results,
        ["name", "Visual Inspection Photo"]
      );
    } else {
      toast.info("Adding new step result");
      const addedStepResult = await mutateAddStepToProcedure({
        authAxios,
        procedureResultId: procedureResultData.id,
        step_definition: recordVisualDefect.step_definition_id,
        execution_number: recordVisualDefect.execution_number,
        disposition: dispositionRequiresReview?.id,
        start_datetime: startDateTime,
      });

      // Look for Visual Inspection Defect,Visual Inspection Observation and Visual Inspection Photo
      visualInspectionDefectMeasurementResult = find(
        addedStepResult.measurement_results,
        ["name", "Visual Inspection Defect"]
      );
      visualInspectionObservationMeasurementResult = find(
        addedStepResult.measurement_results,
        ["name", "Visual Inspection Observation"]
      );
      visualInspectionPhotoMeasurementResult = find(
        addedStepResult.measurement_results,
        ["name", "Visual Inspection Photo"]
      );

      toast.info(
        `Submitting visual inspection defect result for defect #${key}`
      );
    }

    // For Visual Inspection defect, submit disposition and result_defect
    // NON HISTORIC
    let dispositionMeasurementObject: any = {
      authAxios,
      disposition: dispositionRequiresReview?.id,
      result_defect: key,
      asset: assetData.id,
      measurementResultId: visualInspectionDefectMeasurementResult.id,
      start_datetime: startDateTime,
    };

    if (
      historicData &&
      historicDate &&
      historicUser &&
      historicDisposition &&
      assetData
    ) {
      const { start_datetime, ...temp } = dispositionMeasurementObject;
      dispositionMeasurementObject = {
        ...temp,
        user: historicUser.id,
        start_datetime: historicDate,
        historic: true,
        disposition: historicDisposition.id,
      };
    }
    await mutateSubmitMeasurementResult(dispositionMeasurementObject);

    toast.info(`Submitting observation for defect #${key}`);

    // For Visual Inspection observation,submit disposition and result_string with observation
    // NON HISTORIC
    let observationMeasurementObject: any = {
      authAxios,
      disposition: dispositionRequiresReview?.id,
      result_string: visualInspectionDetailsState.defects.get(key)?.observation,
      asset: assetData.id,
      measurementResultId: visualInspectionObservationMeasurementResult.id,
      start_datetime: startDateTime,
    };
    // HISTORIC
    if (
      historicData &&
      historicDate &&
      historicUser &&
      historicDisposition &&
      assetData
    ) {
      const { start_datetime, ...temp } = observationMeasurementObject;
      observationMeasurementObject = {
        ...temp,
        user: historicUser.id,
        start_datetime: historicDate,
        historic: true,
        disposition: historicDisposition.id,
      };
    }
    await mutateSubmitMeasurementResult(observationMeasurementObject);
    toast.info(`Submitting visual inspection result for defect #${key}`);
    // For Visual Inspection Image, Submit disposition, upload all files and store its keys and then link those on the result.

    // NON HISTORIC
    let imageMeasurementObject: any = {
      authAxios,
      disposition: dispositionRequiresReview?.id,
      asset: assetData.id,
      measurementResultId: visualInspectionPhotoMeasurementResult.id,
      start_datetime: startDateTime,
    };
    // HISTORIC
    if (
      historicData &&
      historicDate &&
      historicUser &&
      historicDisposition &&
      assetData
    ) {
      const { start_datetime, ...temp } = imageMeasurementObject;
      imageMeasurementObject = {
        ...temp,
        user: historicUser.id,
        start_datetime: historicDate,
        historic: true,
        disposition: historicDisposition.id,
      };
    }
    await mutateSubmitMeasurementResult(imageMeasurementObject);

    toast.info(`Uploading files for defect #${key}`);
    //Uploading and linking files to measurement.
    const defectImages = visualInspectionDetailsState.defects.get(key)?.images;
    if (defectImages) {
      for (let file of defectImages) {
        const postedFile = await mutatePostFile({ authAxios, file });
        await mutateLinkFileToMeasurement({
          authAxios,
          fileId: postedFile.id,
          measurementId: visualInspectionPhotoMeasurementResult.id,
        });
      }
    }

    if (counter === 0) {
      await mutateSubmitStepResult({
        authAxios,
        disposition: dispositionRequiresReview?.id,
        stepResultId: recordVisualDefect.id,
        start_datetime: startDateTime,
      });
      counter++;
    }
  }
  toast.info(`Submitting visual inspection procedure result`);

  if (
    historicData &&
    historicDate &&
    historicUser &&
    historicDisposition &&
    assetData
  ) {
    //HISTORIC
    await mutateSubmitProcedureResult({
      authAxios,
      disposition: historicDisposition?.id,
      procedureResultId: procedureResultData.id,
    });
  } else {
    //NON HISTORIC
    await mutateSubmitProcedureResult({
      authAxios,
      disposition: dispositionRequiresReview?.id,
      procedureResultId: procedureResultData.id,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
    });
  }
};

const measurementSubmission = async ({
  testerType,
  setConfirmationDialogOpen,
  setSubmissionStatus,
  setSubmittingForm,
  setModal,
  historicData,
  historicDate,
  historicUser,
  historicDisposition,
  assetData,
  procedureResultData,
  values,
  dispositionFailed,
  dispositionPassed,
  minimumMeasurementResultsLength,
  getValueToSubmit,
  startDateTime,
  dispositionRequiresReview,
  closeHistoricModal,
  resetForm,
  history,
  dispatch,
  authAxios,
  mutateSubmitMeasurementResult,
  mutateSubmitStepResult,
  mutateSubmitProcedureResult,
  setClearedValues,
  files,
  raw,
  cropped,
  mutatePostFile,
  mutateLinkFileToMeasurement,
  mutateAddMeasurementToStep,
  noDefectsObserved,
  visualInspectionDetailsState,
  mutateAddStepToProcedure,
  chart,
  backsheetValues,
  showSuccessToast,
}: {
  testerType: TesterTypes;
  setConfirmationDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmissionStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmittingForm?: (isSubmitting: boolean) => void;
  setModal?: React.Dispatch<React.SetStateAction<boolean>>;
  historicData: any;
  historicDate: any;
  historicUser: any;
  historicDisposition: any;
  assetData: any;
  procedureResultData: any;
  values?: any;
  dispositionFailed?: Disposition | undefined;
  dispositionPassed?: Disposition | undefined;
  minimumMeasurementResultsLength?: number;
  getValueToSubmit?: any;
  startDateTime?: any;
  dispositionRequiresReview?: Disposition | undefined;
  closeHistoricModal: any;
  resetForm?: any;
  history: any;
  dispatch: React.Dispatch<Action>;
  authAxios: AxiosInstance;
  mutateSubmitMeasurementResult: UseMutateAsyncFunction<any, any, any, any>;
  mutateSubmitStepResult: UseMutateAsyncFunction<any, any, any, any>;
  mutateSubmitProcedureResult: UseMutateAsyncFunction<any, any, any, any>;
  setClearedValues?: any;
  files?: any[];
  raw?: any[];
  cropped?: any[];
  mutatePostFile?: UseMutateAsyncFunction<any, any, any, any>;
  mutateLinkFileToMeasurement?: UseMutateAsyncFunction<any, any, any, any>;
  mutateAddMeasurementToStep?: UseMutateAsyncFunction<any, any, any, any>;
  noDefectsObserved?: boolean;
  visualInspectionDetailsState?: VisualInspectionDetails;
  mutateAddStepToProcedure?: UseMutateAsyncFunction<any, any, any, any>;
  chart?: number;
  backsheetValues?: any[];
  showSuccessToast?: (message: string) => void;
}) => {
  try {
    setConfirmationDialogOpen && setConfirmationDialogOpen(false);
    setModal && setModal(false);
    setSubmissionStatus(true);
    setSubmittingForm && setSubmittingForm(false);

    if (
      historicData &&
      (!historicDate || !historicUser || !historicDisposition || !assetData)
    ) {
      if (files?.length === 0)
        throw new Error(
          "Asset, reviewer user , reviewer date and at least one file attached are mandatory for capture historic record."
        );
      throw new Error(
        "Asset, user and date are mandatory for capturing historic records."
      );
    }

    let stepResult = procedureResultData.step_results[0];
    let measurementResults = stepResult.measurement_results;
    let endDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    let disposition;

    let cleanupFunction: any;

    //Update Measurements
    switch (testerType) {
      case TesterTypes.Flash:
        for (let measurementResult of measurementResults) {
          let result = null;
          switch (measurementResult.name) {
            case "Pmp":
              result = values.pmp;
              break;
            case "Voc":
              result = values.voc;
              break;
            case "Vmp":
              result = values.vmp;
              break;
            case "Isc":
              result = values.isc;
              break;
            case "Imp":
              result = values.imp;
              break;
            case "Irradiance":
              result = values.irradiance;
              break;
            case "Temperature":
              result = values.temperature;
              break;
            default:
              break;
          }

          if (result === null) {
            continue;
          }

          await mutateSubmitMeasurementResult({
            authAxios,
            user: historicUser.id,
            start_datetime: historicDate,
            historic: true,
            disposition: historicDisposition.id,
            result_double: result,
            asset: assetData.id,
            measurementResultId: measurementResult.id,
          });
          toast.success(`Submitted ${measurementResult.name}`);
        }

        let postedFile = null;

        if (assetData.name.toLowerCase().includes("pasan")) {
          let measurementResult = find(
            procedureResultData.step_results[0].measurement_results,
            ["name", "Data File"]
          );

          let count = 0;

          for (const file of files!) {
            postedFile = await mutatePostFile!({ authAxios, file: file });

            if (count === 0) {
              await mutateSubmitMeasurementResult({
                authAxios,
                user: historicUser.id,
                start_datetime: historicDate,
                historic: true,
                disposition: historicDisposition.id,
                asset: assetData.id,
                measurementResultId: measurementResult.id,
              });

              await mutateLinkFileToMeasurement!({
                authAxios,
                fileId: postedFile.id,
                measurementId: measurementResult.id,
              });

              toast.success(`File ${file.name} Uploaded.`);
            } else {
              let newMeasurement = await mutateAddMeasurementToStep!({
                ...measurementResult,
                authAxios,
                user: historicUser.id,
                start_datetime: historicDate,
                disposition: historicDisposition.id,
                asset: assetData.id,
                stepResultId: procedureResultData.step_results[0].id,
                measurement_definition: Number(
                  measurementResult.measurement_definition.substr(-3, 2)
                ),
              });

              await mutateLinkFileToMeasurement!({
                authAxios,
                fileId: postedFile.id,
                measurementId: newMeasurement.id,
              });
              toast.success(`File ${file.name} Uploaded.`);
            }
            count++;
          }
      } else if (assetData.name.toLowerCase().includes("sinton") || assetData.name.toLowerCase().includes("halm")){
          // This maybe should be the fallback default. Remove the test above to treat
          // all other flash testers the same (all files on one measurement_result)
          let measurementResult = find(
            procedureResultData.step_results[0].measurement_results,
            ["name", "Data File"]
          );

          await mutateSubmitMeasurementResult({
            authAxios,
            user: historicUser.id,
            start_datetime: historicDate,
            historic: true,
            disposition: historicDisposition.id,
            asset: assetData.id,
            measurementResultId: measurementResult.id,
          });

          for (const file of files!) {
            postedFile = await mutatePostFile!({ authAxios, file: file });

            await mutateLinkFileToMeasurement!({
              authAxios,
              fileId: postedFile.id,
              measurementId: measurementResult.id,
            });
            toast.success(`File ${file.name} Uploaded.`);
          }
        }

        await mutateSubmitStepResult({
          authAxios,
          disposition: historicDisposition.id,
          stepResultId: procedureResultData.step_results[0].id,
          start_datetime: procedureResultData.start_datetime,
        });

        await mutateSubmitProcedureResult({
          authAxios,
          disposition: historicDisposition.id,
          procedureResultId: procedureResultData.id,
        });

        toast.success("Flash Test Submitted");
        setSubmittingForm!(false);

        cleanupFunction = () => {
          resetForm();
        };

        break;
      case TesterTypes.EL:
        let elImageRaw = find(
          procedureResultData.step_results[0].measurement_results,
          ["name", "EL Image (raw)"]
        );
        let elImageCropped = find(
          procedureResultData.step_results[0].measurement_results,
          ["name", "EL Image (grayscale)"]
        );
        let postedImage = await mutatePostFile!({ authAxios, file: raw![0] });

        await mutateLinkFileToMeasurement!({
          authAxios,
          fileId: postedImage.id,
          measurementId: elImageRaw.id,
        });

        await mutateSubmitMeasurementResult({
          authAxios,
          user: historicUser.id,
          start_datetime: historicDate,
          historic: true,
          disposition: historicDisposition.id,
          asset: assetData.id,
          measurementResultId: elImageRaw.id,
        });

        toast.info("Uploaded Raw Image");

        postedImage = await mutatePostFile!({ authAxios, file: cropped![0] });
        await mutateLinkFileToMeasurement!({
          authAxios,
          fileId: postedImage.id,
          measurementId: elImageCropped.id,
        });

        await mutateSubmitMeasurementResult({
          authAxios,
          user: historicUser.id,
          start_datetime: historicDate,
          historic: true,
          disposition: historicDisposition.id,
          asset: assetData.id,
          measurementResultId: elImageCropped.id,
        });

        toast.info("Uploaded Cropped Image");

        for (let measurementResult of measurementResults) {
          let result = null;
          switch (measurementResult.name) {
            case "Exposure Count":
              result = values.exposure_count;
              break;
            case "ISO":
              result = values.iso;
              break;
            case "Aperture":
              result = values.aperture;
              break;
            case "Injection Current":
              result = values.injection_current;
              break;
            case "Exposure Time":
              result = values.exposure_time;
              break;
            default:
              break;
          }

          if (result === null) {
            continue;
          }

          await mutateSubmitMeasurementResult({
            authAxios,
            user: historicUser.id,
            start_datetime: historicDate,
            historic: true,
            disposition: historicDisposition.id,
            result_double: result,
            asset: assetData.id,
            measurementResultId: measurementResult.id,
          });
          toast.success(`Submitted ${measurementResult.name}`);
        }

        await mutateSubmitStepResult({
          authAxios,
          disposition: historicDisposition.id,
          stepResultId: procedureResultData.step_results[0].id,
          start_datetime: procedureResultData.start_datetime,
        });

        await mutateSubmitProcedureResult({
          authAxios,
          disposition: historicDisposition.id,
          procedureResultId: procedureResultData.id,
        });
        break;
      case TesterTypes.VisualInspection:
        //TODO: NoDefect and Defect share an order, we could merge them together with some considerations taken
        const inspectModule = find(procedureResultData.step_results, [
          "name",
          "Inspect Module",
        ]);

        if (noDefectsObserved) {
          await noDefectSubmission(
            authAxios,
            procedureResultData,
            dispositionRequiresReview,
            assetData,
            inspectModule,
            startDateTime,
            endDateTime,
            historicData,
            historicDate,
            historicUser,
            historicDisposition,
            mutateSubmitMeasurementResult,
            mutateSubmitStepResult,
            mutateSubmitProcedureResult
          );
        } else {
          await defectSubmission(
            endDateTime,
            procedureResultData,
            authAxios,
            dispositionRequiresReview,
            assetData,
            inspectModule,
            startDateTime,
            historicData,
            historicDate,
            historicUser,
            historicDisposition,
            mutateSubmitMeasurementResult,
            mutateSubmitStepResult,
            visualInspectionDetailsState!,
            mutateAddStepToProcedure!,
            mutatePostFile!,
            mutateLinkFileToMeasurement!,
            mutateSubmitProcedureResult
          );
        }

        toast.success("Visual inspection was correctly saved");

        cleanupFunction = () => {
          setSubmissionStatus(false);
        };

        break;
      case TesterTypes.Colorimeter:
        disposition = dispositionRequiresReview?.id;

        const dataToSubmit = { chart, values: backsheetValues };

        let result = JSON.stringify(dataToSubmit);

        for (let measurementResult of measurementResults) {
          if (result !== null && !historicData) {
            if (!historicData) {
              await mutateSubmitMeasurementResult({
                authAxios,
                disposition,
                [measurementResult.measurement_result_type_field]: result,
                asset: assetData.id,
                measurementResultId: measurementResult.id,
                start_datetime: startDateTime,
              });
            }
          } else if (
            historicData &&
            historicDate &&
            historicUser &&
            historicDisposition &&
            assetData
          ) {
            await mutateSubmitMeasurementResult({
              authAxios,
              disposition: historicDisposition.id,
              [measurementResult.measurement_result_type_field]: result,
              asset: assetData.id,
              measurementResultId: measurementResult.id,
              user: historicUser.id,
              start_datetime: historicDate,
              historic: true,
            });
          }
        }

        cleanupFunction = () => {
          setSubmissionStatus(false);
          setClearedValues(true);
        };
        break;
      case TesterTypes.WetLeakage:
        disposition = !values.passesTest
          ? dispositionFailed?.id
          : dispositionPassed?.id;

        if (
          minimumMeasurementResultsLength &&
          measurementResults.length < minimumMeasurementResultsLength
        ) {
          setSubmissionStatus(false);
          throw new Error(
            `Measurement Results Error for ${TesterTypes[testerType]}`
          );
        }

        for (let measurementResult of measurementResults) {
          let result = getValueToSubmit(measurementResult.name, values);

          if (result !== null) {
            // Non Historic
            console.log("result is not null");
            if (!historicData) {
              await mutateSubmitMeasurementResult({
                authAxios,
                disposition,
                [measurementResult.measurement_result_type_field]:
                  typeof result === "boolean" ? result : parseFloat(result),
                asset: assetData.id,
                measurementResultId: measurementResult.id,
                start_datetime: startDateTime,
              });
            } else if (
              historicData &&
              historicDate &&
              historicUser &&
              historicDisposition &&
              assetData
            ) {
              await mutateSubmitMeasurementResult({
                authAxios,
                [measurementResult.measurement_result_type_field]:
                  typeof result == "boolean" ? result : parseFloat(result),
                asset: assetData.id,
                measurementResultId: measurementResult.id,
                user: historicUser.id,
                start_datetime: historicDate,
                historic: true,
                disposition: historicDisposition.id,
              });
            }
          }
        }

        cleanupFunction = () => {
          resetForm();
          setSubmissionStatus(false);
          setClearedValues(true);
        };
        break;
      case TesterTypes.IAM:
        for (let measurementResult of measurementResults) {
          let result = null;

          switch (measurementResult.name) {
            case "IAM at 0° AOI":
              result = values.zero;
              break;
            case "IAM at 5° AOI":
              result = values.five;
              break;
            case "IAM at 10° AOI":
              result = values.ten;
              break;
            case "IAM at 15° AOI":
              result = values.fifteen;
              break;
            case "IAM at 20° AOI":
              result = values.twenty;
              break;
            case "IAM at 25° AOI":
              result = values.twentyFive;
              break;
            case "IAM at 30° AOI":
              result = values.thirty;
              break;
            case "IAM at 35° AOI":
              result = values.thirtyFive;
              break;
            case "IAM at 40° AOI":
              result = values.fourty;
              break;
            case "IAM at 45° AOI":
              result = values.fourtyFive;
              break;
            case "IAM at 50° AOI":
              result = values.fifty;
              break;
            case "IAM at 55° AOI":
              result = values.fiftyFive;
              break;
            case "IAM at 60° AOI":
              result = values.sixty;
              break;
            case "IAM at 65° AOI":
              result = values.sixtyFive;
              break;
            case "IAM at 70° AOI":
              result = values.seventy;
              break;
            case "IAM at 75° AOI":
              result = values.seventyFive;
              break;
            case "IAM at 80° AOI":
              result = values.eigthy;
              break;
            case "IAM at 85° AOI":
              result = values.eightyFive;
              break;
            case "IAM at 90° AOI":
              result = values.ninety;
              break;
            default:
              break;
          }

          if (result == null) {
            continue;
          }

          await mutateSubmitMeasurementResult({
            authAxios,
            user: historicUser.id,
            start_datetime: historicDate,
            historic: true,
            disposition: historicDisposition.id,
            result_double: result,
            asset: assetData.id,
            measurementResultId: measurementResult.id,
          });

          showSuccessToast!(`Submitted ${measurementResult.name}`);
        }

        await mutateSubmitStepResult({
          authAxios,
          disposition: historicDisposition.id,
          stepResultId: procedureResultData.step_results[0].id,
          start_datetime: procedureResultData.start_datetime,
        });

        await mutateSubmitProcedureResult({
          authAxios,
          disposition: historicDisposition.id,
          procedureResultId: procedureResultData.id,
        });

        showSuccessToast!("IAM Test Submitted");
        setSubmittingForm!(false);
        setSubmissionStatus(false);
        break;
      case TesterTypes.Diode:
        disposition = !values.passesTest
          ? dispositionFailed!.id
          : dispositionPassed!.id;

        if (measurementResults.length < minimumMeasurementResultsLength!) {
          setSubmissionStatus(false);
          throw new Error("Measurement Results Error for Diode Test");
        }

        for (let measurementResult of measurementResults) {
          let result = getValueToSubmit(measurementResult.name, values);
          if (result !== null) {
            // NON HISTORIC
            if (!historicData) {
              await mutateSubmitMeasurementResult({
                authAxios,
                disposition,
                [measurementResult.measurement_result_type_field]:
                  typeof result === "boolean" ? result : parseFloat(result),
                asset: assetData.id,
                measurementResultId: measurementResult.id,
                start_datetime: startDateTime,
              });
              // HISTORIC
            } else if (
              historicData &&
              historicDate &&
              historicUser &&
              historicDisposition &&
              assetData
            ) {
              await mutateSubmitMeasurementResult({
                authAxios,
                [measurementResult.measurement_result_type_field]:
                  typeof result === "boolean" ? result : parseFloat(result),
                asset: assetData.id,
                measurementResultId: measurementResult.id,
                user: historicUser.id,
                start_datetime: historicDate,
                historic: true,
                disposition: historicDisposition.id,
              });
            }
          }
        }

        cleanupFunction = () => {
          setSubmissionStatus(false);
          setClearedValues(true);
        };
        break;
      default:
        break;
    }

    if (
      testerType === TesterTypes.WetLeakage ||
      testerType === TesterTypes.Colorimeter ||
      testerType === TesterTypes.Diode
    ) {
      const startDateTimeStepResult = historicData
        ? procedureResultData.start_datetime
        : startDateTime;

      // Update Step Results
      await mutateSubmitStepResult({
        authAxios,
        disposition,
        stepResultId: stepResult.id,
        start_datetime: startDateTimeStepResult,
      });

      // Update Procedure Results
      if (
        historicData &&
        historicDate &&
        historicUser &&
        historicDisposition &&
        assetData
      ) {
        // Historic
        await mutateSubmitProcedureResult({
          authAxios,
          disposition: historicDisposition?.id,
          procedureResultId: procedureResultData.id,
        });
      } else {
        // Non Historic
        await mutateSubmitProcedureResult({
          authAxios,
          disposition: dispositionRequiresReview?.id,
          procedureResultId: procedureResultData.id,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
        });
      }
    }

    if (closeHistoricModal) {
      closeHistoricModal();
    } else {
      resetForm && resetForm();
      cleanupFunction && cleanupFunction();
    }

    toast.success("Measurement Saved");
  } catch (err) {
    toast.error(`Error while saving measurements ${err}`);
    setSubmissionStatus(false);
    processErrorOnMutation(err, dispatch, history);
  }
};

export default measurementSubmission;
