export const getStaticMapUrl = (lat:Number, lon: Number) => {
    return  `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${lon},${lat}&z=12&l=map&size=600,300&pt=${lon},${lat},flag`
}
