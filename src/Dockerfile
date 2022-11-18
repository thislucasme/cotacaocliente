Dockerfile:
FROM 19-alpine3.15
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent
COPY . ./
CMD ["npm", "start"]
For React Image Creation: 
docker build -t containername:tag
For Running Container: 
docker run -it -p 3000:3000 containername:tag