-- CreateTable
CREATE TABLE "Station" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journey" (
    "departure_time" TIMESTAMP(3) NOT NULL,
    "return_time" TIMESTAMP(3) NOT NULL,
    "departure_station" TEXT NOT NULL,
    "departure_station_id" INTEGER NOT NULL,
    "return_station" TEXT NOT NULL,
    "return_station_id" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "covered_distance" DOUBLE PRECISION NOT NULL,
    "month" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);
