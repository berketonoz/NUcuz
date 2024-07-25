FROM node:18.12.1-bullseye-slim

RUN npm install -g npm@9.1.3

ADD package.json .
ADD app.js .
ADD product.js .
ADD data/products.json .
COPY . .
RUN npm install

EXPOSE 3030

CMD [ "node", "app.js" ]
