import http from 'k6/http';
import { sleep } from 'k6';

export const url = 'http://host.docker.internal:80';

export const options = {
    stages: [
        { duration: '10s', target: 3 }, //low of normal load
        { duration: '1m', target: 3 },
        { duration: '10s', target: 14 }, // spike for 14 users
        { duration: '3m', target: 14 }, // keep 14 users for 3 minutes
        { duration: '10s', target: 3 }, // ramp-down - recovery
        { duration: '3m', target: 3 },
        { duration: '10s', target: 0 },
    ],
};

//VU
export default function () {
    http.get(url);
    sleep(1);
}
