FROM bitnami/node:18

WORKDIR /app
COPY package*.json /app/

RUN npm install -g npm
RUN npm install --omit=dev --unsafe-perm=true 

COPY ./ /app/
EXPOSE 3000
CMD [ "node", "index.js" ]
