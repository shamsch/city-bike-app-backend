FROM python:alpine as importing_csv

WORKDIR /app

COPY data/script/requirements.txt /app

RUN pip install -r requirements.txt

COPY data/script/import_and_validate_csv.py /app

CMD ["python", "import_and_validate_csv.py"]

FROM node:alpine as server 

WORKDIR /server 

COPY package.json /server

RUN npm install

COPY . /server

COPY --from=importing_csv /app/data /server/

CMD ["npm", "start"]