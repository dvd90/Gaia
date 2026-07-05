import api from "./api";

describe("api client", () => {
  it("targets the configured API base URL", () => {
    expect(api.defaults.baseURL).toBeTruthy();
  });

  it("attaches the auth token from localStorage to requests", () => {
    localStorage.setItem("token", "my-token");
    const handler = api.interceptors.request.handlers[0].fulfilled;
    const config = handler({ headers: {} });
    expect(config.headers["x-auth-token"]).toBe("my-token");
  });

  it("sends no token header when logged out", () => {
    const handler = api.interceptors.request.handlers[0].fulfilled;
    const config = handler({ headers: {} });
    expect(config.headers["x-auth-token"]).toBeUndefined();
  });
});
