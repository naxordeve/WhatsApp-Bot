FROM node:20-alpine
COPY package.json .
RUN npm i --legacy-peer-deps
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
