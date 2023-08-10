/// <reference types="cypress" />

import { Server } from "miragejs";
import { makeServer } from "../../src/mockServer/index";

describe("CRA", () => {
  let server: Server;

  beforeEach(() => {
    server = makeServer({
      environment: "test",
      host: "/api/1.0",
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Login components exist", () => {
    cy.findByTestId("login-email").should("exist");
    cy.findByTestId("login-password").should("exist");
    cy.findByTestId("login-submit").should("exist");
  });

  it("Should login succesfully", () => {
    server.create("signin");
    server.createList("crate", 20);

    /*  cy.findByTestId("login-email").type("rene");
    cy.findByTestId("login-password").type("password");
    cy.findByTestId("login-submit").click();
    cy.findByTestId("tableContainer").should("exist");
    cy.url().should("contain", "/home"); */
    cy.login();
  });
});
