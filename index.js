import axios from "axios";
import connection from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const { FRESHDESK_API_KEY, GITHUB_TOKEN, FRESHDESK_SUBDOMAIN } = process.env;

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
  },
});

const freshdeskApi = axios.create({
  baseURL: `https://${FRESHDESK_SUBDOMAIN}.freshdesk.com/api/v2`,
  headers: {
    Authorization: `Basic ${Buffer.from(`${FRESHDESK_API_KEY}:X`).toString(
      "base64"
    )}`,
  },
});

const getUserData = async (username) => {
  try {
    const { data } = await githubApi.get(`/users/${username}`);
    const email =
      data.email ||
      (await githubApi.get(data.url).then((response) => response.data.email));

    console.log("Retrieved email:", email);

    return { ...data, email };
  } catch (error) {
    throw new Error(`Failed to fetch GitHub user data: ${error.message}`);
  }
};

export { getUserData };

const createContact = async (userData) => {
  const data = {
    name: userData.name || userData.login,
    email: userData.email,
  };

  const created_at = new Date(userData.created_at)
    .toISOString()
    .replace("T", " ")
    .replace("Z", "");

  try {
    const { data: contact } = await freshdeskApi.post("/contacts", data);
    console.log(`Contact ${contact.id} created successfully in Freshdesk.`);
    // insert new contact info into database
    connection.query(
      "INSERT INTO users (id, login, name, email, created_at, freshdesk_contact_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userData.id,
        userData.login,
        userData.name,
        userData.email,
        created_at,
        contact.id,
      ],
      (error, results) => {
        if (error) {
          console.error("Error inserting new user:", error);
        }
      }
    );
    return contact;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log(`Contact already exists in Freshdesk, updating...`);
      const existingContact = await findContactByEmail(userData.email);
      return updateContact(existingContact.id, userData);
    }
    throw new Error(`Failed to create Freshdesk contact: ${error.message}`);
  }
};

export { createContact };

const updateContact = async (contactId, userData) => {
  const data = {
    name: userData.name || userData.login,
    email: userData.email,
  };

  try {
    const { data: contact } = await freshdeskApi.put(
      `/contacts/${contactId}`,
      data
    );
    console.log(`Contact ${contact.id} updated successfully in Freshdesk.`);

    return contact;
  } catch (error) {
    throw new Error(`Failed to update Freshdesk contact: ${error.message}`);
  }
};

export { updateContact };

const findContactByEmail = async (email) => {
  try {
    const { data: contacts } = await freshdeskApi.get(
      `/contacts?email=${email}`
    );

    return contacts.length > 0 ? contacts[0] : null;
  } catch (error) {
    throw new Error(
      `Failed to search for contact in Freshdesk: ${error.message}`
    );
  }
};

export { findContactByEmail };

const main = async () => {
  try {
    const [username, subdomain] = process.argv.slice(2);

    if (!username || !subdomain) {
      throw new Error(
        "Please provide a GitHub username and a Freshdesk subdomain."
      );
    }

    // get user data from GitHub
    const userData = await getUserData(username);

    // find existing contact by email
    const existingContact = await findContactByEmail(userData.email);

    if (existingContact) {
      // update existing contact with user data
      const updatedContact = await updateContact(existingContact.id, userData);

      // update user record with freshdesk contact id
      connection.query(
        "UPDATE users SET freshdesk_contact_id = ? WHERE login = ?",
        [updatedContact.id, username],
        (error, results) => {
          if (error) {
            console.error("Error updating user:", error);
          } else {
            console.log(
              `User ${username} updated successfully with contact ID ${updatedContact.id}.`
            );
          }
        }
      );
    } else {
      // create new contact with user data
      const newContact = await createContact(userData);

      // update user record with freshdesk contact id
      connection.query(
        "UPDATE users SET freshdesk_contact_id = ? WHERE login = ?",
        [newContact.id, username],
        (error, results) => {
          if (error) {
            console.error("Error updating user:", error);
          } else {
            console.log(
              `User ${username} created successfully with contact ID ${newContact.id}.`
            );
          }
        }
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    connection.end();
  }
};
main();
