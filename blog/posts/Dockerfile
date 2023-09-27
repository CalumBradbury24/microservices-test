FROM node:18

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]

# docker run -it 726b0a38caa0 bash - opens a shell in the container where you can start it from etc