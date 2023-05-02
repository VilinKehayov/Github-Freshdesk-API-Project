import { createFreshdeskContact } from '../index.js';




describe("createFreshdeskContact", () => {
  it("should create a new contact in Freshdesk", async () => {
    const githubUserData = { name: "Test User", email: "test@example.com" };
    const contact = await createFreshdeskContact(githubUserData);
    expect(contact).toBeDefined();
    expect(contact.id).toBeDefined();
  });
});
