import http from 'k6/http';
import {sleep} from 'k6';

export const url = 'http://host.docker.internal:80';

export const options = {
    stages: [
        { duration: '2m', target: 3 }, // low of normal load
        { duration: '5m', target: 3 },
        { duration: '2m', target: 5 }, // load
        { duration: '5m', target: 5 },
        { duration: '2m', target: 7 }, // stress point
        { duration: '5m', target: 7 },
        { duration: '2m', target: 10 }, // beyond the stress point
        { duration: '5m', target: 10 },
        { duration: '10m', target: 0 }, // ramp-down - recovery stage
      ],
};

//VU
export default function (){
    http.get(url);
    sleep(1);
}
