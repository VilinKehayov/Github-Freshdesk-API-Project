import fetch from "node-fetch";
import connection from './db.js'
import { config } from "dotenv";
config();

// Parse command line arguments
const githubUsername = 'VilinKehayov';
const freshdeskSubdomain = 'vilinkehayov';

if (!githubUsername || !freshdeskSubdomain) {
  console.error("Please provide a GitHub username and a Freshdesk subdomain.");
  process.exit(1);
}

// Set up API endpoints and authentication
const githubUrl = `https://api.github.com/users/${githubUsername}`;
console.log(githubUrl);
const freshdeskContactsUrl = `https://${freshdeskSubdomain}.freshdesk.com/api/v2/contacts`;
const freshdeskAuth = `${process.env.FRESHDESK_API_KEY}:X`;

// Retrieve user data from GitHub API
export const getGitHubUserData = async () => {
  const response = await fetch(githubUrl, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user data: ${response.statusText}`);
  }

  const data = await response.json();

  // Try to get email from user data or public profile
  const email =
    data.email ||
    (await fetch(`${data.url}.json`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => data.email));
  console.log("Retrieved email:", email);

  // Insert user data into the MySQL database
  const user = {
    login: data.login,
    name: data.name,
    created_at: new Date(data.created_at),
  };

  connection.query("INSERT INTO users SET ?", user, (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
    } else {
      console.log("User inserted successfully with ID:", result.insertId);
    }
  });

  // Return user data with updated email field
  return { ...data, email };
};

// Find an existing contact in Freshdesk by email address
export const findExistingContact = async (email) => {
  const url = `${freshdeskContactsUrl}?email=${email}`;
  console.log(url);
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(freshdeskAuth).toString("base64")}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to search for contact in Freshdesk: ${response.statusText}`
    );
  }

  const results = await response.json();
  return results.length > 0 ? results[0] : null;
};

export const createFreshdeskContact = async (githubUserData) => {
  const data = {
    name: githubUserData.name || githubUserData.login,
    email: githubUserData.email,
  };

  const authHeader = `Basic ${Buffer.from(freshdeskAuth).toString("base64")}`;
  const response = await fetch(freshdeskContactsUrl, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create Freshdesk contact: ${response.statusText}`
    );
  }

  return await response.json();
};

// Update an existing contact in Freshdesk with new data
export const updateFreshdeskContact = async (contactId, githubUserData) => {
  const data = {
    name: githubUserData.name || githubUserData.login,
    email: githubUserData.email,
  };

  const url = `${freshdeskContactsUrl}/${contactId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${Buffer.from(freshdeskAuth).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update Freshdesk contact: ${response.statusText}`
    );
  }

  return await response.json();
};

// Main function
const main = async () => {
  try {
    // Retrieve user data from GitHub API
    const githubUserData = await getGitHubUserData();

    // Find an existing contact in Freshdesk by email address
    const existingContact = await findExistingContact(githubUserData.email);

    if (existingContact) {
      // Update existing contact with new data
      console.log(
        `Updating existing contact ${existingContact.id} in Freshdesk...`
      );
      await updateFreshdeskContact(existingContact.id, githubUserData);
      console.log(`Contact ${existingContact.id} updated successfully.`);

      // Update the MySQL database with the contact's ID
      connection.query(
        "UPDATE users SET freshdesk_contact_id = ? WHERE login = ?",
        [existingContact.id, githubUserData.login],
        (err, result) => {
          if (err) {
            console.error("Error updating user:", err);
          } else {
            console.log("User updated successfully.");
          }
        }
      );
    } else {
      // Create new contact in Freshdesk
      console.log(`Creating new contact in Freshdesk...`);
      const newContact = await createFreshdeskContact(githubUserData);
      console.log(`Contact ${newContact.id} created successfully.`);
    }

    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

main();
