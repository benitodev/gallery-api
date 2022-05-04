import supertest from "supertest";
import app from "../../app.js";
export const request = supertest;
export const api = supertest(app);

export const initialImages = [
  {
    name: "Ball",
    url: "https://images.pexels.com/photos/10931575/pexels-photo-10931575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    userId: [],
  },
  {
    name: "Horses",
    url: "https://images.pexels.com/photos/10931575/pexels-photo-10931575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    userId: [],
  },
];
export const getImagesData = async (url = "/image", statusCode = 200) => {
  const res = await api
    .get(url)
    .expect(statusCode)
    .expect("Content-Type", /json/);

  return res.body.content;
};

export const createImage = async (statusCode, image = false) => {
  const res = await api
    .post("/image")
    .send(
      image
        ? image
        : {
            name: "House",
            url: "https://images.pexels.com/photos/10931575/pexels-photo-10931575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            userId: [],
          }
    )
    .expect(statusCode);
  const error = res.body.error;
  if (error) {
    return error;
  }
  return res.body;
};

const nonExistingId = () => {};
