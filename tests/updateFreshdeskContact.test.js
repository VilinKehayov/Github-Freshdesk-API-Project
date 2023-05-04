import axios from 'axios';
import { updateContact } from '../index.js';

jest.mock('axios');

describe('updateContact', () => {
  const contactId = 1234;
  const userData = {
    name: 'John Smith',
    email: 'john.smith@example.com',
  };
  const expectedData = {
    id: 1234,
    name: 'John Smith',
    email: 'john.smith@example.com',
  };

  beforeEach(() => {
    axios.put.mockReset();
  });

  it('should update a contact in Freshdesk and return the updated contact', async () => {
    axios.put.mockResolvedValueOnce({ data: expectedData });

    const result = await updateContact(contactId, userData);

    expect(result).toEqual(expectedData);
    expect(axios.put).toHaveBeenCalledWith(`/contacts/${contactId}`, userData);
  });

  it('should throw an error if the update fails', async () => {
    const errorMessage = 'Failed to update contact';
    axios.put.mockRejectedValueOnce(new Error(errorMessage));

    await expect(updateContact(contactId, userData)).rejects.toThrow(
      `Failed to update Freshdesk contact: ${errorMessage}`
    );
  });
});
