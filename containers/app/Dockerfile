FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npx quasar prepare
EXPOSE 8080
CMD ["sh", "-c", "npx quasar dev -m spa --host 0.0.0.0 --port 8080"]