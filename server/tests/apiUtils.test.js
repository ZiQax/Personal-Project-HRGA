const { handleRequest } = require('../services/apiUtils');

describe('apiUtils - handleRequest', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  test('should return 200 and data on success', async () => {
    const mockAction = jest.fn().mockResolvedValue({ id: 1, name: 'Test' });
    
    await handleRequest(mockRes, mockAction);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Success',
      data: { id: 1, name: 'Test' }
    });
  });

  test('should return custom success status', async () => {
    const mockAction = jest.fn().mockResolvedValue({ id: 1 });
    
    await handleRequest(mockRes, mockAction, 201);

    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  test('should return 404 when data is not found (null)', async () => {
    const mockAction = jest.fn().mockResolvedValue(null);
    
    await handleRequest(mockRes, mockAction);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Data Not Found'
    });
  });

  test('should return 404 when data is an empty array', async () => {
    const mockAction = jest.fn().mockResolvedValue([]);
    
    await handleRequest(mockRes, mockAction);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  test('should return 500 on action failure', async () => {
    const mockError = new Error('DB Connection Failed');
    const mockAction = jest.fn().mockRejectedValue(mockError);
    
    await handleRequest(mockRes, mockAction);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Database Error'
    }));
  });
});
