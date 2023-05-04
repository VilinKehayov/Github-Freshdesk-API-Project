import axios from 'axios';
import { getUserData } from '../index.js';

jest.mock('axios');

describe('getUserData', () => {
  it('should retrieve user data and email from GitHub API', async () => {
    const mockUserData = {
      id: 123,
      name: 'John Doe',
      email: 'johndoe@example.com',
      url: 'https://api.github.com/users/johndoe',
    };
    const mockGithubApiResponse = {
      data: mockUserData,
    };
    const mockGithubEmailResponse = {
      data: {
        email: mockUserData.email,
      },
    };
    axios.get.mockImplementationOnce((url) => {
      if (url === mockUserData.url) {
        return Promise.resolve(mockGithubApiResponse);
      } else {
        return Promise.resolve(mockGithubEmailResponse);
      }
    });

    const result = await getUserData('johndoe');

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledWith(mockUserData.url);
    expect(axios.get).toHaveBeenCalledWith(mockUserData.url);
    expect(result).toEqual(mockUserData);
  });

  it('should throw an error if GitHub API request fails', async () => {
    const mockErrorMessage = 'GitHub API error';
    axios.get.mockRejectedValueOnce(new Error(mockErrorMessage));

    await expect(getUserData('johndoe')).rejects.toThrow(
      `Failed to fetch GitHub user data: ${mockErrorMessage}`
    );
  });
});

