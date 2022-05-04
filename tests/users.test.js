import mongoose from "mongoose";
import server from "../index.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import {
  api,
  initialUsers,
  getDataOfUsers,
  newUser,
  postUser,
} from "./helpers/users.js";

beforeEach(async () => {
  await User.deleteMany({});
  //sequential
  for (const user of initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const userInstance = new User({ ...user, password: passwordHash });
    await userInstance.save();
  }
});

describe("GET users", () => {
  test("are returned as json", async () => {
    await api.get("/user").expect(200).expect("Content-Type", /json/);
  });

  //this varies depending on the number of initialUsers
  test(`There are three users`, async () => {
    const { users } = await getDataOfUsers();
    expect(users).toHaveLength(initialUsers.length);
  });

  test("contains a user with the username benitoka", async () => {
    const { find } = await getDataOfUsers();
    expect(find).toContain("benitoka");
  });
});

describe("POST users", () => {
  test("is added correctly", async () => {
    //postUser contains params of password (boolean) and statusCode that expect
    await postUser(true, 201);
    const { users, find } = await getDataOfUsers();
    expect(find).toContain(newUser().username);
    expect(users).toHaveLength(initialUsers.length + 1);
  });

  test("without password could not be added", async () => {
    await postUser(false, 400);
    const { users } = await getDataOfUsers();
    expect(users).toHaveLength(initialUsers.length);
  });

  test("create fails if username is already in use", async () => {
    const { users: firstResponse } = await getDataOfUsers();

    const res = await api
      .post("/user")
      .send({ username: "pomelin", name: "otherPomelito", password: "678" })
      .expect(400)
      .expect("Content-Type", /json/);
    expect(res.body.error).toContain("error in create user");

    //check if user wasn't created anyway
    const { users: secondResponse } = await getDataOfUsers();
    expect(secondResponse).toHaveLength(firstResponse.length);
  });
});

describe("DELETE users", () => {
  test("can be deleted", async () => {
    const { users: firstResponse } = await getDataOfUsers();
    const userToDelete = firstResponse[0];
    await api.delete(`/user/${userToDelete.id}`).expect(204);
    const { users: secondResponse, find } = await getDataOfUsers();

    expect(secondResponse).toHaveLength(initialUsers.length - 1);
    expect(find).not.toContain(userToDelete.username);
  });

  test("if do not exist can not be deleted", async () => {
    await api.delete(`/user/1234`).expect(404);
    const { users } = await getDataOfUsers();
    console.log(users);
    expect(users).toHaveLength(initialUsers.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
