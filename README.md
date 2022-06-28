

git clone https://github.com/vitateje/performance-tests

Com Docker rodando e projeto clonado, entre na pasta do projeto, faça upload dos containers e dispare os testes com os seguintes comandos:

cd performance-tests
docker-compose up -d influxdb grafana
docker-compose run k6 run /scripts/conexaoQA.js

Agora basta abrir o browser em http://localhost:3000/d/k6/k6-load-testing-results?orgId=1&refresh=5s e verificar o resultado da sua execução em tempo real com gráficos e métricas de forma clara e simples:

O container K6 contém a ferramenta responsável por criar, executar e coletar os resultados dos testes de performance. Os resultados dessas execuções são salvos no container do InfluxDB (o nosso banco de dados). Essa comunicação entre K6 e InfluxDB acontece via rede, chamada de Rede K6.

Com os dados no banco, o container Grafana (que é uma ferramenta de dashboard) consome essas informações e exibe em seus widgets, montando um dashboard. A comunicação entre Grafana e InfluxDB é feita via Rede Grafana.

Para realizar os testes, o InfluxDB e o Grafana já devem estar rodando no sistema, por isso é necessário executar o primeiro comando: docker-compose up -d influxdb grafana

A flag -d no comando serve  para não deixar o terminal preso e o processo de subir os containers roda em background.

Com isso, é possível  disparar qualquer teste já escrito, com o seguinte comando: docker-compose run k6 run /scripts/conexaoQA.js

Explorando os arquivos
Conheça a função de cada arquivo:

docker-compose.yml

Este é o arquivo que contém toda a estrutura necessária para rodar os testes. Duas redes e três serviços são definidos, sendo eles:

influxdb: banco de dados que roda a imagem influxdb:1.8 na porta 8086 e tem acesso às redes k6 e grafana
grafana: visualização dos dados que roda a imagem grafana/grafana:latest na porta 3000 e tem acesso apenas a rede grafana
k6: executa os testes de performance que roda a imagem loadimpact/k6:latest na porta 6565 e tem acesso apenas a rede k6
Os environments declarados são variáveis de ambientes definidos nos containers para que seja possível acessar e rodar os  testes sem nenhum problema.

Os volumes são arquivos que estão no projeto e compartilhados com os containers. Por exemplo, o arquivo de código grafana-datasource.yaml irá substituir o arquivo /etc/grafana/provisioning/datasources/datasource.yaml que está dentro do container Grafana. Os três arquivos que você vai compartilhar são:

grafana-datasource.yaml

Configure o Grafana para utilizar como fonte de dados o InfluxDB. Para isso, sinalize no campo type o mesmo nome do serviço criado no docker-compose.yml para o InfluxDB.

grafana-dashboard.yaml

Configure o Grafana para carregar o dashboard do K6 a partir da pasta /var/lib/grafana/dashboards que está dentro do container. Por padrão o Grafana não tem nenhum dashboard.

dashboards/ k6-load-testing-results_rev3.json

JSON contém todas as configurações do dashboard para o Grafana e como ele deve ser exibido na tela, incluindo os gráficos, textos e qualquer outra informação. Existem vários layouts de dashboard para Grafana prontos na internet e disponibilizados pela comunidade. Este arquivo utilizado neste artigo pode ser encontrado no link: https://grafana.com/grafana/dashboards/2587

No projeto há apenas uma única atualização em relação ao arquivo que foi baixado na comunidade. Foi definido no JSON como fonte dados o container que roda o InfluxDB.

Quando rodamos o docker-compose, este arquivo é salvo dentro do container do Grafana na pasta /var/lib/grafana/dashboards, o mesmo caminho que apontamos no arquivo grafana-dashboard.yaml

scripts/ conexaoQA.js

Contém scripts K6 para testes na API http://conexaoqa.herokuapp.com/api/profile

Neste teste, 5 usuários virtuais concorrentes em um período de 5 segundos, ou seja, 1 usuário novo a cada 1 segundo, são adicionados.  Esse processo é chamado de ramp up. Em seguida, estes 5 usuários virtuais no sistema são mantidos por um período de 30 segundos.

Por último, estes 5 usuários virtuais são removidos em 5 segundos, ou seja, um usuário é removido a cada segundo. Esse processo de remoção é chamado de ramp down. Abaixo temos o gráfico de carga de usuários virtuais ao longo de tempo:

VUs = Virtual Users

Estes usuários fazem uma requisição para API http://conexaoqa.herokuapp.com/api/profile a cada 0.3 segundos durante todo o período que estão ativos. Esse delay de 0.3s acontece devido ao sleep que foi colocado no script.

Também foi adicionado um threshold, ou seja, uma validação. Caso 90% das requisições levem um tempo maior que 15 segundos, o teste irá falhar.

Para resumir,  a const options contém o plano de execução e default function contém o script que cada VU (Virtual User) irá executar.

Conclusão
O projeto e o docker-compose configurados podem ser reutilizados em qualquer lugar, sendo necessário apenas criar os scripts na pasta /scripts.

Além disso, o K6 é open-source e já existe uma grande comunidade ajudando com dúvidas. Grandes empresas no mundo já adotaram a ferramenta. Seu diferencial é a integração com outras ferramentas e possibilidade de desenvolver códigos simples para os testes de performance.

Saiba mais sobre o K6, acesse o link da documentação: https://k6.io/docs/

https://blog.gft.com/br/2022/01/18/testes-de-performance-com-k6-e-docker-compose/