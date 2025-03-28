FROM node:20-alpin
COPY package.json .
RUN npm i --legacy-peer-deps
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
