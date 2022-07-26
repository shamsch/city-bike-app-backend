import {expect} from "chai";
import "mocha";

import app from "../..";

import request from "supertest";
import { metersToKilometers } from "../utils/convertUnit";


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

    it("have search in month, return and departure station", async () => {
        const searchTerm = "mAy";
        const searchResponse = await request(app).get(`/api/journey?search=${searchTerm}`);

        expect(searchResponse.status).to.equal(200);

        expect(searchResponse.body).to.be.an("array");

        // either be an empty array or have at least one element
        if (searchResponse.body.length !== 0) {
            // search through all the keys of the first element
            for (let key in searchResponse.body[0]) {
                // if the key is a string and the value of the first element contains the search term
                if (typeof searchResponse.body[0][key] === "string" && searchResponse.body[0][key].toLowerCase().includes(searchTerm.toLowerCase())) {
                    // then we have a match
                    expect(true).to.equal(true);
                    return;
                }
            }
            // if we get here, then we didn't find a match
            expect(true).to.equal(false);
        }
    }
    )

    it("have duration min and max filter", async () => {
        //unit is minutes
        const durationMin = 10;
        const durationMax = 20;
        const durationResponse = await request(app).get(`/api/journey?durationMin=${durationMin}&durationMax=${durationMax}`);

        expect(durationResponse.status).to.equal(200);

        expect(durationResponse.body).to.be.an("array");

        // duration is between the min and max
        expect(durationResponse.body[0].duration).to.be.greaterThan(durationMin);
        expect(durationResponse.body[0].duration).to.be.lessThan(durationMax);
    }
    )

    it("have covered distance min and max filter", async () => {
        // unit is km
        const coveredDistanceMin = 0.1;
        const coveredDistanceMax = 1.0;
        const coveredDistanceResponse = await request(app).get(`/api/journey?distanceMin=${coveredDistanceMin}&distanceMax=${coveredDistanceMax}`);

        expect(coveredDistanceResponse.status).to.equal(200);

        expect(coveredDistanceResponse.body).to.be.an("array");
        if (coveredDistanceResponse.body.length !== 0) {
            expect(coveredDistanceResponse.body[0].covered_distance).to.be.greaterThan(coveredDistanceMin);
            expect(coveredDistanceResponse.body[0].covered_distance).to.be.lessThan(coveredDistanceMax);
        }
    }
    )
}
)