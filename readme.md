Running the Program

To run the program, you will need to provide two command line arguments:

1.GitHub username: The username of the GitHub user whose information you want to retrieve.

2.Freshdesk subdomain: The subdomain of your Freshdesk account.
Here is an example command:

node index.js [GitHub username] [Freshdesk subdomain]

Replace [GitHub username] with the actual GitHub username and [Freshdesk subdomain] with the actual subdomain of your Freshdesk account.

Program Description

This program retrieves the email address of a GitHub user using the GitHub API and then checks if a contact with that email already exists in your Freshdesk account. If a contact exists, the program updates the contact with the new email address. If a contact does not exist, the program creates a new contact in Freshdesk with the GitHub user's name and email address.

The program uses the node-fetch library to make API requests to GitHub and Freshdesk, and the dotenv library to read environment variables from a .env file. You will need to set up a .env file with the following variables:

GITHUB_TOKEN=[GitHub personal access token]
FRESHDESK_API_KEY=[Freshdesk API key]

Replace [GitHub personal access token] with your actual GitHub personal access token and [Freshdesk API key] with your actual Freshdesk API key.

Before running the program, make sure you have installed the required dependencies by running the following command:

npm install

HOW TO RUN THE TESTS.

To run the tests using Jest:

1.Open a terminal and navigate to the project directory
2.Run node --experimental-vm-modules node_modules/jest/bin/jest.js to run all tests in the tests/ directory
3.To run a specific test file, run node --experimental-vm-modules node_modules/jest/bin/jest.js The file name.test.js
