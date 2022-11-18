Dockerfile:
FROM node:13.12.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent
COPY . ./
CMD ["npm", "start"]
------------------------------------------------------------------------------------------
.dockerignore:
node_modules
build
.dockerignore
Dockerfile
Dockerfile.prod
----------------------------------------------
For React Image Creation: 
docker build -t containername:tag
For Running Container: 
docker run -it -p 3000:3000 containername:tag
ds
