jest.mock("mongoose", () => ({ connect: jest.fn() }));

const mongoose = require("mongoose");
const connectDB = require("../config/db");

describe("connectDB", () => {
  const ENV = { ...process.env };

  afterEach(() => {
    process.env = { ...ENV };
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("connects using MONGO_URI when set", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    process.env.MONGO_URI = "mongodb://localhost/gaia-test";
    mongoose.connect.mockResolvedValue({});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost/gaia-test"
    );
  });

  it("falls back to the legacy split variables", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    delete process.env.MONGO_URI;
    process.env.mongoUser = "u";
    process.env.mongoPW = "p";
    process.env.mongoURI = "@cluster/gaia";
    mongoose.connect.mockResolvedValue({});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith("mongodb://u:p@cluster/gaia");
  });

  it("exits the process when the connection fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const exit = jest.spyOn(process, "exit").mockImplementation(() => {});
    process.env.MONGO_URI = "mongodb://localhost/gaia-test";
    mongoose.connect.mockRejectedValue(new Error("refused"));

    await connectDB();

    expect(exit).toHaveBeenCalledWith(1);
  });
});
