import axios from "axios";
import { createContact } from "../index.js";

jest.mock("axios");

describe("createContact", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new contact", async () => {
    const userData = {
      id: 1,
      login: "testuser",
      name: "Test User",
      email: "testuser@example.com",
      created_at: "2022-01-01T00:00:00Z",
    };
    const freshdeskResponse = { data: { id: 123 } };
    axios.post.mockResolvedValueOnce(freshdeskResponse);

    const result = await createContact(userData);

    expect(result).toEqual(freshdeskResponse.data);
    expect(axios.post).toHaveBeenCalledWith("/contacts", {
      name: userData.name,
      email: userData.email,
    });
    expect(connection.query).toHaveBeenCalledWith(
      "INSERT INTO users (id, login, name, email, created_at, freshdesk_contact_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userData.id,
        userData.login,
        userData.name,
        userData.email,
        expect.any(String),
        freshdeskResponse.data.id,
      ],
      expect.any(Function)
    );
  });

  it("should update an existing contact", async () => {
    const userData = {
      id: 1,
      login: "testuser",
      name: "Test User",
      email: "testuser@example.com",
      created_at: "2022-01-01T00:00:00Z",
    };
    const existingContact = { id: 123 };
    const freshdeskResponse = { data: { id: 123 } };
    axios.post.mockRejectedValueOnce({
      response: { status: 409 },
    });
    axios.get.mockResolvedValueOnce({ data: existingContact });
    axios.put.mockResolvedValueOnce(freshdeskResponse);

    const result = await createContact(userData);

    expect(result).toEqual(freshdeskResponse.data);
    expect(axios.post).toHaveBeenCalledWith("/contacts", {
      name: userData.name,
      email: userData.email,
    });
    expect(axios.get).toHaveBeenCalledWith("/contacts", {
      params: { email: userData.email },
    });
    expect(axios.put).toHaveBeenCalledWith(`/contacts/${existingContact.id}`, {
      name: userData.name,
    });
    expect(connection.query).toHaveBeenCalledWith(
      "INSERT INTO users (id, login, name, email, created_at, freshdesk_contact_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userData.id,
        userData.login,
        userData.name,
        userData.email,
        expect.any(String),
        freshdeskResponse.data.id,
      ],
      expect.any(Function)
    );
  });

  it("should throw an error when failed to create a contact", async () => {
    const userData = {
      id: 1,
      login: "testuser",
      name: "Test User",
      email: "testuser@example.com",
      created_at: "2022-01-01T00:00:00Z",
    };
    const error = new Error("Failed to create Freshdesk contact");
    axios.post.mockRejectedValueOnce(error);

    await expect(createContact(userData)).rejects.toThrow(error);

    expect(axios.post).toHaveBeenCalledWith("/contacts", {
      name: userData.name,
      email: userData.email,
    });
  });
});
