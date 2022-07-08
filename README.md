git clone https://github.com/vitateje/performance-tests

Com Docker rodando e projeto clonado, entre na pasta do projeto, faça upload dos containers e dispare os testes com os seguintes comandos:

cd performance-tests
docker-compose up -d influxdb grafana
docker-compose run k6 run /scripts/performance-base.js

grafana http://localhost:3000/d/k6/k6-load-testing-results?orgId=1&refresh=5s 

to run

docker-compose run k6 run /scripts/performance-base.js

Saiba mais sobre o K6, acesse o link da documentação: https://k6.io/docs/

https://blog.gft.com/br/2022/01/18/testes-de-performance-com-k6-e-docker-compose/