const { updateIzinKeluar } = require('../controlers/izinKeluar');
const modelIzinKeluar = require('../models/modelIzin');
const apiUtils = require('../services/apiUtils');

// Mock the model and apiUtils
jest.mock('../models/modelIzin');
jest.mock('../services/apiUtils');

describe('izinKeluar Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: { id: '1' },
      body: { status: 'Disetujui' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    // Default implementation for handleRequest
    apiUtils.handleRequest.mockImplementation(async (res, action, status) => {
      const data = await action();
      return res.status(status || 200).json({ success: true, data });
    });
  });

  test('updateIzinKeluar should return 400 if ID is missing', async () => {
    mockReq.params.id = undefined;
    
    await updateIzinKeluar(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Status dan ID tidak boleh kosong'
    }));
  });

  test('updateIzinKeluar should return 400 if status is missing', async () => {
    mockReq.body.status = undefined;
    
    await updateIzinKeluar(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test('updateIzinKeluar should call model.updateIzin and return 201', async () => {
    modelIzinKeluar.updateIzin.mockResolvedValue({ affectedRows: 1 });
    
    await updateIzinKeluar(mockReq, mockRes);

    expect(modelIzinKeluar.updateIzin).toHaveBeenCalledWith('Disetujui', '1');
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });
});
