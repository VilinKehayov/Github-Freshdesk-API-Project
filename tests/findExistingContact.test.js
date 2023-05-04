import axios from 'axios';
import { findContactByEmail } from '../index.js';

jest.mock('axios');

describe('findContactByEmail', () => {
  it('should return the contact when it exists', async () => {
    const email = 'johndoe@example.com';
    const expectedContact = { id: 1, name: 'John Doe', email };
    const response = { data: [expectedContact] };
    axios.get.mockResolvedValue(response);

    const result = await findContactByEmail(email);

    expect(result).toEqual(expectedContact);
    expect(axios.get).toHaveBeenCalledWith('/contacts', { params: { email } });
  });

  it('should return null when the contact does not exist', async () => {
    const email = 'johndoe@example.com';
    const response = { data: [] };
    axios.get.mockResolvedValue(response);

    const result = await findContactByEmail(email);

    expect(result).toBeNull();
    expect(axios.get).toHaveBeenCalledWith('/contacts', { params: { email } });
  });

  it('should throw an error when the API call fails', async () => {
    const email = 'johndoe@example.com';
    const error = new Error('Request failed');
    axios.get.mockRejectedValue(error);

    await expect(findContactByEmail(email)).rejects.toThrow(
      `Failed to search for contact in Freshdesk: ${error.message}`
    );
    expect(axios.get).toHaveBeenCalledWith('/contacts', { params: { email } });
  });
});

