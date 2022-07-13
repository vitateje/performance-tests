install k6:

https://k6.io/docs/getting-started/installation/

install docker:

https://docs.docker.com/engine/install/

git clone https://github.com/vitateje/performance-tests

with docker running

cd performance-tests
docker-compose up -d influxdb grafana
docker-compose run k6 run /scripts/performance-base.js

grafana http://localhost:3000/d/k6/k6-load-testing-results?orgId=1&refresh=5s 

to run:

docker-compose run k6 run /scripts/performance-base.js
