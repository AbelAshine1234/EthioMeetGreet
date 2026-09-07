FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for native modules and Prisma query engine
RUN apk add --no-cache python3 make g++ openssl

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
