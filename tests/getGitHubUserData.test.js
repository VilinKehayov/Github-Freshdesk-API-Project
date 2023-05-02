import { getGitHubUserData } from '../index.js';

describe("getGitHubUserData", () => {
  it("should retrieve user data from GitHub API", async () => {
    const userData = await getGitHubUserData();
    expect(userData.login).toBeDefined();
    expect(userData.email).toBeDefined();
  });
});
