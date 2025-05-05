describe("quote acceptance flow", () => {
  const uuid = Cypress.env("generated_uuid");
  it("should load with valid uuid", () => {
    cy.visit(`http://localhost:3000/payin/${uuid}`);

    // Step 1: Open the popover
    cy.get('[data-testid="currency-selector"]').should("be.visible").click();

    // Step 2: Ensure the popover is visible (optional but helpful)
    cy.get('[data-testid="currency-menu"]').should("be.visible");

    // Step 3: Click one of the items
    cy.get('[data-testid="currency-item"]').contains("Ethereum").click();

    // Step 4: Intercept the PUT request for accepting the quote
    cy.intercept("PUT", "**/pay/**/update/summary").as("getQuoteForCurrency");

    // Step 6: Click confirm button
    cy.get('[data-testid="accept-button"]').click();
    cy.intercept("PUT", "**/pay/**/accept").as("acceptQuote");

    // Step 5: Ensure the QR code is visible
    cy.get('[data-testid="qr-code"]').should("be.visible");
  });
});

// describe("quote expiry", () => {
//   const uuid = Cypress.env("generated_uuid");
//   it("should redirect to expired page", () => {
//     cy.visit(`http://localhost:3000/payin/${uuid}`);
//     cy.wait(35000);
//     cy.location("pathname").should("equal", "/payin/expired");
//   });
// });
