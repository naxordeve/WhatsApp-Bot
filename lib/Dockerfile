FROM node:20-alpine
RUN apk add --no-cache git
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080

CMD ["npm", "start"]
