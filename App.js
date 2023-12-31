import * as Location from "expo-location";

import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    const filterJson = json.list.filter((weather) => {
      if (weather.dt_txt.includes("00:00:00")) {
        return weather;
      }
    });
    setDays(filterJson);
    // console.log(JSON.stringify(filterJson, null, 2));
    // console.log(JSON.stringify(json, null, 2));
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator style={{ marginTop: 10 }} size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={50} color={"black"} />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
  },
  weather: {
    // flex: 3,
    // backgroundColor: "teal",
  },
  day: {
    // flex: 1,
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    // marginLeft: 20,
    paddingLeft: 20,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 128,
  },
  description: {
    fontWeight: "500",
    marginTop: -30,
    fontSize: 40,
  },
  tinyText: {
    fontSize: 30,
  },
});
