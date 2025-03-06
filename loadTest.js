import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "1m", target: 1000 },
    { duration: "5m", target: 100000 },
    { duration: "1m", target: 0 },
  ],
};

export default function () {
  let res = http.get("http://localhost:3000/api/weather?city=Cairo");
  check(res, { "status was 200": (r) => r.status === 200 });
  sleep(1);
}
