import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const User = [
  {
    id: "jaemin",
    nickname: "재민",
    image: faker.image.avatar(),
  },
  {
    id: "zerocho",
    nickname: "제로초",
    image: faker.image.avatar(),
  },
];

export const handlers = [
  http.post(`${baseUrl}/api/login`, () => {
    console.log("로그인");
    return HttpResponse.json(User[0], {
      headers: {
        "Set-Cookie": "connect.sid=msw-cookie;HttpOnly;Path=/",
      },
    });
  }),
  http.post(`${baseUrl}/api/logout`, () => {
    console.log("로그아웃");
    return new HttpResponse(null, {
      headers: {
        "Set-Cookie": "connect.sid=;HttpOnly;Path=/;Max-Age=0",
      },
    });
  }),
  http.post(`${baseUrl}/api/users`, async ({ request }) => {
    console.log("회원가입");
    // return HttpResponse.text(JSON.stringify('user_exists'), {
    //   status: 403,
    // });
    return HttpResponse.text(JSON.stringify("ok"), {
      headers: {
        "Set-Cookie": "connect.sid=msw-cookie;HttpOnly;Path=/",
      },
    });
  }),
];
