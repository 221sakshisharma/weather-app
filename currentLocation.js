const locationAccessToken = "pk.1caac905e41df398d538921dd71f5e81";

    const getCoordinates = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                () => {
                    reject("No position available");
                }
            );
        });
    };

    const getCity = async () => {
        try {
            const { latitude, longitude } = await getCoordinates();
            const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${locationAccessToken}&lat=${latitude}&lon=${longitude}&format=json`);
            const locationData = await response.json();
            return locationData.address?.city || locationData.address?.town || locationData.address?.village
        } catch (error) {
            console.log(error);
        }
    };

export default getCity;