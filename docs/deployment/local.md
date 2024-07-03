# Development Setup

### Prerequisites
Changes you need to do only when running the application for development purposes. **If you are on the latest commit on main, you will need to do any below modifications to deploy.**

#### Frontend Modifications
Head over to `frontend/vite.config.js` and follow the instructions there.
You will need to comment the line
```js
const { REACT_APP_BASE_URL, REACT_APP_API_URL } = process.env;
```
and uncomment these lines
```js
const REACT_APP_BASE_URL = "http://127.0.0.1:8080";
const REACT_APP_API_URL = "http://127.0.0.1:8000";
```
#### Backend Modifications
The file `pacmanweb/config.py` has a variable called `MODE` which should be set to `dev` if using manual setup.
```py
MODE = "dev"
```

### Frontend Installation
To install frontend dependencies, start by installing node and npm. Instructions to do so can be found here- https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-nodejs-and-npm

```bash
npm install
npm run dev
```

### Backend Installation
#### Install Conda Environments
Head over to the PACManWeb directory. This environment installation has been done using Mamba and tested on Linux and Mac. Installing might work using Conda, but Mamba is recommended. To install mamba, head over too the [mamba installation page](https://mamba.readthedocs.io/en/latest/installation/mamba-installation.html).
```bash
mamba env create --file env.yml --name pacmanweb
```

#### Setting up Celery
PACMan web implements task queues in Celery to run PACMan tasks one by one. Celery requires Redis as backend and RabbitMQ as a message broker to run.
- Redis installation instructions can be found on the redis website- https://redis.io/docs/install/install-redis/.
- Redis can also be installed like so-
```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```
- RabbitMQ instructions can be found here- https://www.rabbitmq.com/download.html. Once installed, RabbitMQ will need to be setup with these commands- https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/rabbitmq.html#setting-up-rabbitmq.

Once Redis and RabbitMQ are setup, you can start running celery. 
```bash
celery -A pacmanweb.celery_app worker --loglevel=info -c 10 -E
```

#### Starting Flask Application
To start Flask in developement mode-
```bash
flask --app pacmanweb run --port 8000 --debug
```