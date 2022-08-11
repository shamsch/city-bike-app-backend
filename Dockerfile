FROM python:latest as importing_csv

WORKDIR /app

COPY data/script/requirements.txt /app

RUN pip install -r requirements.txt

COPY data/script/import_and_validate_csv.py /app

RUN python import_and_validate_csv.py

FROM node:alpine as server 

WORKDIR /server 

COPY package.json /server

RUN npm install

COPY . /server

COPY --from=importing_csv /app/csv /server/csv

CMD ["npm", "run", "start:docker"]