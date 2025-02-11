FROM node:14

# Install expo-cli and @expo/ngrok globally
RUN npm install -g expo-cli @expo/ngrok

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

EXPOSE 19006

CMD ["expo", "start", "--tunnel", "--host", "0.0.0.0"]