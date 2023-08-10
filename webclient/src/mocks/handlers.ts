import moment from "moment";
import { rest } from "msw";
import { db } from "./db";

export const handlers = [
  rest.post(`/api/1.0/signin/`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(db.signin.getAll()[0]));
  }),
  rest.get(`/api/1.0/noop/`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(db.signin.getAll()[0]));
  }),
  rest.get(`/api/1.0/customers/`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ results: db.customer.getAll() }));
  }),
  rest.get(`/api/1.0/projects/:id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(db.project.findFirst({ where: { id: { equals: 1 } } }))
    );
  }),
  rest.get(`/api/1.0/projects/:id/pi_summary_table`, (req, res, ctx) => {
    let summaryTableResponse = {
      project_percent_complete: 10.23,
      work_orders: {
        "1": {
          name: "Test Work Order",
          work_order_percent_complete: 50.36,
          start_datetime: null,
          operational_efficiency: 0.55566,
          test_sequence_definitions: {},
        },
      },
    };
    return res(ctx.status(200), ctx.json(summaryTableResponse));
  }),
  rest.get(`/api/1.0/projects/:id/actions/`, (req, res, ctx) => {
    let actionsResponse = {
      work_orders: [
        {
          id: 1,
          name: "WO1",
          completed_actions: 2,
          total_actions: 7,
          actions: [
            {
              id: 1,
              name: "WO1 Intake Report",
              description: "action workorder test",
              disposition__name: "Recycle after 30 days",
              execution_group: 1.0,
              data_ready: false,
              completion_criteria: {
                action_completion_definition: 1,
                criteria_completed: true,
                completed_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                eta_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            },
            {
              id: 2,
              name: "WO1 Intake Report 2",
              description: "action workorder test 2",
              disposition__name: "Recycle after 60 days",
              execution_group: 1.0,
              data_ready: true,
              completion_criteria: {
                action_completion_definition: 1,
                criteria_completed: true,
                completed_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                eta_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            },
            {
              id: 3,
              name: "WO1 Intake Report 3",
              description: "action workorder test",
              disposition__name: "Recycle after 180 days",
              execution_group: 1.0,
              data_ready: false,
              completion_criteria: {
                action_completion_definition: 1,
                criteria_completed: true,
                completed_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                eta_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            },
          ],
        },
        {
          id: 2,
          name: "BSA",
          completed_actions: 4,
          total_actions: 22,
          actions: [
            {
              id: 1,
              name: "BSA Intake Report",
              description: "action workorder test",
              disposition__name: "Recycle after 30 days",
              execution_group: 1.0,
              data_ready: true,
              completion_criteria: {
                action_completion_definition: 1,
                criteria_completed: true,
                completed_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                eta_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            },
            {
              id: 2,
              name: "BSA Intake Report 2",
              description: "action workorder test 2",
              disposition__name: "Recycle after 60 days",
              execution_group: 1.0,
              data_ready: true,
              completion_criteria: {
                action_completion_definition: 1,
                criteria_completed: true,
                completed_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                eta_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            },
            {
              id: 3,
              name: "BSA Intake Report 3",
              description: "action workorder test",
              disposition__name: "Recycle after 180 days",
              execution_group: 1.0,
              data_ready: true,
              completion_criteria: {
                action_completion_definition: 1,
                criteria_completed: true,
                completed_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                eta_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            },
          ],
        },
        {
          id: 3,
          name: "POE",
          completed_actions: 5,
          total_actions: 12,
          actions: [
            {
              id: 1,
              name: "POE Intake Report",
              description: "action workorder test",
              disposition__name: "Recycle after 30 days",
              execution_group: 1.0,
              data_ready: true,
              completion_criteria: {
                action_completion_definition: 1,
                criteria_completed: true,
                completed_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                eta_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            },
            {
              id: 2,
              name: "POE Intake Report 2",
              description: "action workorder test 2",
              disposition__name: "Recycle after 60 days",
              execution_group: 1.0,
              data_ready: true,
              completion_criteria: {
                action_completion_definition: 1,
                criteria_completed: true,
                completed_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                eta_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            },
            {
              id: 3,
              name: "POE Intake Report 3",
              description: "action workorder test",
              disposition__name: "Recycle after 180 days",
              execution_group: 1.0,
              data_ready: true,
              completion_criteria: {
                action_completion_definition: 1,
                criteria_completed: true,
                completed_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                eta_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
            },
          ],
        },
      ],
      completed_actions: 1,
      total_actions: 34,
      actions: [],
    };
    return res(ctx.status(200), ctx.json(actionsResponse));
  }),
];
