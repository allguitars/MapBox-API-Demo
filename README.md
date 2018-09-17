# Earthquake Map
### Earthquakes that have happened during the past 30 days
Made a page that shows the magnitude of the earthquakes by drawing circles with different diameters for earthquakes that occurred all over the world for the past 30 days, and the information is instant.

1. First, I had to draw a map using Mapbox API and set the parameters for the map, such as longitude, latitude, zooming scale, bearing (rotation angle), and pitch (perspective angle).
2. Then I made a query for the instant earthquake information through [USGS API](https://earthquake.usgs.gov/fdsnws/event/1/).
3. Project the lcoations of the earthquakes onto the map by Web Mercator formula, which is a common way for map projection. I found the formula on [Wikipedia](https://en.wikipedia.org/wiki/Web_Mercator_projection).
4. Convert the Ritcher magnitude of the earthquakes into measured amplitude and draw the circles accordingly. I also found the formula on Wikipedia.
5. I was learning how to call the open API and found this project on a YouTube channel called [The Coding Train](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw). I did this project because, as a Taiwanese, earthquakes are quite relevant to our daily life.
