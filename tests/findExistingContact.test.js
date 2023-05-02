import { findExistingContact } from '../index.js';



describe("findExistingContact", () => {
  it("should find an existing contact by email", async () => {
    const email = "test@example.com"; // Replace with an existing email in your Freshdesk account
    const contact = await findExistingContact(email);
    expect(contact).not.toBeNull();
    expect(contact.id).toBeDefined();
  });

  it("should return null for a non-existent email", async () => {
    const email = "nonexistent@example.com";
    const contact = await findExistingContact(email);
    expect(contact).toBeNull();
  });
});
