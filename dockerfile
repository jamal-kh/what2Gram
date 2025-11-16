FROM node:20

WORKDIR /what2gram

COPY package.json .

RUN npm i

COPY . .

CMD ["npm" , "install"]