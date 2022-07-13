import http from 'k6/http';
import { sleep } from 'k6';

export const url = 'http://host.docker.internal:80';

export const options = {
    stages: [
        { duration: '2m', target: 14 }, // ramp up to 14 users
        { duration: '10m', target: 14 }, // keep 14 users for 10 minutes
        { duration: '2m', target: 0 }, // ramp-down (optional)
    ],
};

//VU
export default function () {
    http.get(url);
    sleep(1);
}
