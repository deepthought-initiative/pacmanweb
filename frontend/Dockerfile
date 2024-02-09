FROM node:21-alpine3.18
WORKDIR /frontend
COPY . .
RUN npm install
RUN npm install rollup
RUN npm run build