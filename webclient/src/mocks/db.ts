import { factory, primaryKey } from "@mswjs/data";
import { name, datatype, random } from "faker";

export const db = factory({
  customer: {
    id: primaryKey(datatype.uuid),
    name: name.findName,
    project_numbers: () => [],
  },
  signin: {
    id: primaryKey(datatype.uuid),
    build: () => "DEVELOPMENT",
    expires_in: datatype.string,
    token: datatype.string,
    user: () => "rlopez",
  },
  project: {
    id: primaryKey(datatype.number),
    url: random.word,
    number: random.word,
    sfdc_number: random.word,
    project_manager: random.word,
    project_manager_name: random.word,
    customer: random.word,
    customer_name: random.word,
    group: random.word,
    start_date: random.word,
    disposition: random.word,
    disposition_name: random.word,
    proposal_price: () => null,
    percent_complete: datatype.number,
    notes: () => [],
    note_count: datatype.number,
  },
});

db.customer.create();
db.signin.create();
db.project.create({ id: 1 });
