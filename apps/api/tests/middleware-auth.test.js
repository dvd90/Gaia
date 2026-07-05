const auth = require("../middleware/auth");
const { generateToken } = require("../utils/generateToken");
const { USER_ID } = require("./helpers");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const reqWithHeaders = headers => ({
  header: name => headers[name.toLowerCase()]
});

describe("auth middleware", () => {
  it("rejects requests without a token", () => {
    const res = mockRes();
    const next = jest.fn();
    auth(reqWithHeaders({}), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects invalid tokens", () => {
    const res = mockRes();
    const next = jest.fn();
    auth(reqWithHeaders({ "x-auth-token": "garbage" }), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: "Token is not valid" });
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts a valid x-auth-token header", () => {
    const req = reqWithHeaders({ "x-auth-token": generateToken(USER_ID) });
    const next = jest.fn();
    auth(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: USER_ID });
  });

  it("accepts a standard Authorization: Bearer header", () => {
    const req = reqWithHeaders({
      authorization: `Bearer ${generateToken(USER_ID)}`
    });
    const next = jest.fn();
    auth(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: USER_ID });
  });

  it("ignores a malformed Authorization header", () => {
    const res = mockRes();
    const next = jest.fn();
    auth(reqWithHeaders({ authorization: "Token abc" }), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("falls back to the legacy jwtSecret env var", () => {
    const saved = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    process.env.jwtSecret = "legacy-secret";

    const req = reqWithHeaders({ "x-auth-token": generateToken(USER_ID) });
    const next = jest.fn();
    auth(req, mockRes(), next);
    expect(next).toHaveBeenCalled();

    process.env.JWT_SECRET = saved;
    delete process.env.jwtSecret;
  });
});
