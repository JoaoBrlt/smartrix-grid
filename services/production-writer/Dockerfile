FROM node:14-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --silent --no-progress --no-audit --no-optional --no-fund
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
