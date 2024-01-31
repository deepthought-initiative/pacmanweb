# Backend Installation

#### Install Conda Environment
This environment installation has been done using Mamba and tested on Linux and Mac. Installing might work using Conda, but Mamba is recommended. To install mamba, head over too the [mamba installation page](https://mamba.readthedocs.io/en/latest/installation/mamba-installation.html).
```none
mamba env create --file env.yml --name pacmanweb
```

#### Setting up Celery
PACMan web implements task queues in Celery to run PACMan tasks one by one. Celery requires Redis and backend and RabbitMQ as a message broker to run.
- Redis installation instructions can be found on the redis website- https://redis.io/docs/install/install-redis/.
- RabbitMQ instructions can be found here- https://www.rabbitmq.com/download.html. Once installed, RabbitMQ will need to be setup with these commands- https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/rabbitmq.html#setting-up-rabbitmq.

Once Redis and RabbitMQ are setup, you can start running celery. 
```none
celery -A pacmanweb.celery_app worker --loglevel=info
```

#### Starting Flask Application
To start Flask in developement mode-
```none
flask run
```