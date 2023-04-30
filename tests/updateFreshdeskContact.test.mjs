import { findExistingContact, updateFreshdeskContact } from '../index.js';

describe("updateFreshdeskContact", () => {
  it("should update an existing contact in Freshdesk", async () => {
    const email = "test@example.com"; // Replace with an existing email in your Freshdesk account
    const contact = await findExistingContact(email);
    expect(contact).not.toBeNull();
    expect(contact.id).toBeDefined();
    const updatedContact = await updateFreshdeskContact(contact.id, {
      name: "Updated User",
      email: "updated@example.com",
    });
    expect(updatedContact).toBeDefined();
    expect(updatedContact.id).toEqual(contact.id);
    expect(updatedContact.name).toEqual("Updated User");
    expect(updatedContact.email).toEqual("updated@example.com");
  });
});
