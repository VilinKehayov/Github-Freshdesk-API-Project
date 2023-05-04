Freshdesk Contact Creator

This is a command-line program that creates or updates a contact in Freshdesk based on a GitHub user's data.

Functionality

The program does the following:

1.Retrieves a GitHub user's data using their username.
2.Searches for an existing contact in Freshdesk using the user's email.
3.If an existing contact is found, updates the contact's data with the user's data.
4.If an existing contact is not found, creates a new contact with the user's data.
5.Inserts the new contact information into a MySQL database.

Instructions

To run the program, follow these steps:

Clone the repository and navigate to the project directory.

Install the required dependencies using the command npm install.

Set up the required environment variables by creating a .env file in the project directory with the following fields:

FRESHDESK_API_KEY=<your_freshdesk_api_key>
FRESHDESK_SUBDOMAIN=<your_freshdesk_subdomain>
GITHUB_TOKEN=<your_github_token>
DB_HOST=<your_host>
DB_USER=<your user>
DB_PASSWORD=<your password>
DB_NAME=<your_db_name>

Replace the placeholders with your own values.

Run the program using the command node index.js <github_username> <freshdesk_subdomain>.

The program will output logs to the console indicating the actions taken.

Dependencies

1.axios: HTTP client for making requests to GitHub and Freshdesk APIs.
2.dotenv: Loads environment variables from a .env file.
3.mysql: MySQL client for connecting to a MySQL database.
4.jest and axios-mock-adapter: Used for testing.

































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
