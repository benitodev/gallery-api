import supertest from "supertest";
import app from "../../app.js";
export const api = supertest(app);
export const initialUsers = [
  {
    username: "example",
    name: "exp",
    password: "123",
  },
  {
    username: "benitoka",
    name: "benito",
    password: "321",
  },
  {
    username: "pomelin",
    name: "pomelito",
    password: "456",
  },
];

export const newUser = (password = false) => {
  if (password)
    return {
      username: "michi",
      name: "killita",
      password: "321",
    };
  return { username: "michi", name: "killita" };
};

export const postUser = async (password, statusCode = 200) => {
  await api
    .post("/user")
    .send(newUser(password))
    .expect(statusCode)
    .expect("Content-Type", /json/);
};
export const getDataOfUsers = async () => {
  const res = await api.get("/user");
  const users = res.body.content;
  const find = res.body.content.map((user) => user.username);
  return { find, res, users };
};
