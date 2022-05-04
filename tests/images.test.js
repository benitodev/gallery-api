import mongoose from "mongoose";
import server from "../index.js";
import Image from "../models/Image.js";
import {
  api,
  createImage,
  getImagesData,
  initialImages,
} from "./helpers/images.js";

beforeEach(async () => {
  await Image.deleteMany({});
  await Image.insertMany(initialImages);
});

describe("GET images", () => {
  test("all initial notes are returned", async () => {
    const images = await getImagesData();

    expect(images).toHaveLength(initialImages.length);
  });
  test("all notes are returned as json", async () => {
    await getImagesData();
  });
});

describe("GET viewing a specific note", () => {
  test("a specific note contains some name", async () => {
    const images = await getImagesData();
    const expectName = images.map((img) => img.name);
    expect(expectName).toContain("Ball");
  });
  test("succeeds with a valid id and return the same object", async () => {
    const images = await getImagesData();
    const imageToView = images[0];
    const specificNote = await getImagesData(`/image/${imageToView.id}`);
    const processedNoteToView = JSON.parse(JSON.stringify(specificNote));
    expect(imageToView).toEqual(processedNoteToView);
  });
  test("fails with statuscode 404 if note id doesn't exist", async () => {
    const anyId = "65234523123";
    const notExists = await getImagesData(`/image/${anyId}`, 404);
  });
});

describe("POST create", () => {
  test("is successful with valid data", async () => {
    const usersRes = await getImagesData("/user");
    const creatorUser = usersRes[0];
    const imageToSend = {
      name: "testImage",
      url: "https://images.pexels.com/photos/10931575/pexels-photo-10931575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      userId: [creatorUser.id],
    };

    //helper to create image
    await createImage(201, imageToSend);
    const imageRes = await getImagesData("/image");
    const imagesAtEnd = imageRes;
    expect(imagesAtEnd).toHaveLength(initialImages.length + 1);
  });
  test("fails with statuscode 400 if data is invalid", async () => {
    const usersRes = await getImagesData("/image");
    const creatorUser = usersRes[0];
    const imageToSend = {
      name: "testImage",
      userId: [creatorUser.id],
    };

    const res = await createImage(400, imageToSend);
    expect(res).toContain("you must send the all data");
  });
});

describe("DELETE image", () => {
  test("is successful from database with valid data", async () => {
    const imagesAtStart = await getImagesData();
    const imageToDelete = imagesAtStart[0];
    await api.delete(`/image/${imageToDelete.id}`).expect(204);
    const imagesAtEnd = await getImagesData();
    expect(imagesAtEnd).toHaveLength(imagesAtEnd.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
