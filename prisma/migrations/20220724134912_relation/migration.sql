-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_departure_station_id_fkey" FOREIGN KEY ("departure_station_id") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_return_station_id_fkey" FOREIGN KEY ("return_station_id") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
