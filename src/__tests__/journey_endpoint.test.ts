import {expect} from "chai";
import "mocha";

import app from "../..";

const request = require("supertest");

describe("Expect journey to", () => {
    it("return 10 journey by default", async () => {
        const response = await request(app).get("/api/journey");

        expect(response.status).to.equal(200);

        expect(response.body).to.be.an("array");

        expect(response.body).to.have.lengthOf(10);
    }) 

    it("return journey with id, departure_station, return_station, covered_distance etc.", async () => {
        const response = await request(app).get("/api/journey");

        expect(response.status).to.equal(200);

        expect(response.body[0]).to.have.all.keys(["id", "departure_station", "return_station", "departure_time", "return_time", "departure_station_id", "return_station_id", "covered_distance",  "duration", "id", ]);
    }
    )

    it("have pagination with limit", async () => {
        const firstPage = await request(app).get("/api/journey?page=1&limit=5");

        expect(firstPage.status).to.equal(200);

        expect(firstPage.body).to.be.an("array");

        expect(firstPage.body).to.have.lengthOf(5);

        const secondPage = await request(app).get("/api/journey?page=2&limit=5");

        expect(secondPage.status).to.equal(200);

        expect(secondPage.body).to.be.an("array");

        expect(secondPage.body).to.have.lengthOf(5);

        expect(firstPage.body).to.not.equal(secondPage.body);

        // the second page starts from where the first page ends in terms of id as the id is SERIAL
        expect(firstPage.body[4].id).to.equal(secondPage.body[0].id+1);
    }
    )

    it("have ordering by columns", async () => {
        const idTestResponse = await request(app).get("/api/journey?orderBy=id&orderDir=desc&limit=8");

        expect(idTestResponse.status).to.equal(200);

        expect(idTestResponse.body).to.be.an("array");

        expect(idTestResponse.body).to.have.lengthOf(8);

        // id is descending
        expect(idTestResponse.body[0].id).to.be.greaterThan(idTestResponse.body[1].id);

        const coveredDistanceTestResponse = await request(app).get("/api/journey?orderBy=covered_distance&orderDir=asc");

        expect(coveredDistanceTestResponse.status).to.equal(200);

        expect(coveredDistanceTestResponse.body).to.be.an("array");

        expect(coveredDistanceTestResponse.body).to.have.lengthOf(10);

        // covered_distance is ascending
        expect(coveredDistanceTestResponse.body[0].covered_distance).to.be.lessThan(coveredDistanceTestResponse.body[1].covered_distance);
    })

    
}
)