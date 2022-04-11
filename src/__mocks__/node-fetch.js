const responseMockObj = ({
  reset: () => {
    responseMockObj.ok = true;
    responseMockObj.statusText = '';
    responseMockObj.json.mockClear();
    responseMockObj.text.mockClear();
    responseMockObj.buffer.mockClear();
    responseMockObj.toString.mockClear();
  },
  ok: true,
  statusText: '',
  json: jest.fn(),
  text: jest.fn(),
  buffer: jest.fn(),
  toString: jest.fn()
});

responseMockObj.buffer.mockReturnValue(responseMockObj);

const fetchMock = jest.fn().mockImplementation((path, options) => responseMockObj);

module.exports = fetchMock;
module.exports.responseMock = responseMockObj;
