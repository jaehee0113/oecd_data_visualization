## OECD Data Visualization
Visualizing OECD data using D3.js.

Note that node_modules folder was not uploaded.

The project was built using Bower, Gulp, D3.js, Dimple.js, JavaScript (with jQuery and Bootstrap).

This is the early stage of this project so stay tuned! :)

###Summary

The data drawn from OECD Stat database is about ‘inflows of foreign population.’ Each record has the following key attributes:
* nationality, country, year, value (# of inflows)

I was intrigued by this data because I was curious about which country attracted the most migrants. First, I produced a time-series line graph from 2000 to 2013 and showed the changes. Second, I produced a map showing the total inflows of migrants by each country (so practically I aggregated data by country). 

###Design

I wanted to see top 6 destination for migrants between 2000 and 2013. I clearly wanted to see the changes in trend so line graph was the best choice for me. In terms of visual, I felt that it was a bad idea to include every country as the graph would be cluttered and be highly ineffective. As such, I just decided to extract top 6 from the csv file and display them on the graph. I created two layers (both line and scatter plot) and it looked much better (when hovering on to each point, we can of course see the details as well). 

![Graph](https://cdn-enterprise.discourse.org/udacity/uploads/default/optimized/3X/a/0/a083ecede68d666f8f7017e8e2407b66cf898e57_1_690x328.png)

Initially, I wanted to give more animation to the map by giving a ‘year’ slider so that the shading of different parts of the map changes accordingly. However, this was not useful as there was no significant difference between years (as shown in a graph). Thus, this plan was not carried out.

Furthermore, the legends for the map had some problems initially. I aggregated data over ‘country’ and summed up all values. However, the USA and Germany had significantly high number of inflows in total so the colors became almost negligible (i.e. other than USA and Germany, most countries’ color looked extremely similar).

![Graph](https://cdn-enterprise.discourse.org/udacity/uploads/default/optimized/3X/e/8/e892933dc0bbaaae471cdb1dfc48e2b8aef96ff0_1_690x364.png)

Therefore, with the feedback received from people, I decided to shade USA and Germany with the color ‘yellow’ and I gave color gradation for data from 20495 and 900000. As a result, the color was clearly visible.

Furthermore, to allow users to see the specific details (i.e. the total number of migrants) I added a tooltip. This was done because even if there are differences in colors, users would want to know more (certainly I want to know more). 

###Feedback

I received three constructive feedbacks for my first version via Udacity forum from the following users:
* Myles
* georgeliu1998
* aarthyvallur

The **feedbacks** were:
* The main message does not jump immediately (for this I added more details to the data description in 'Home' tab)
* There are no color differences for the map visualization and does not understand the reason for using yellow color for the USA.
* For the first graph, adding a title to the graph would be better
* It would be better to have some statistical measures (such as central tendency) included in the graph.
* Bubble chart would be better than the line graph for time series.

I have responded to feedbacks accordingly. However, for bubble chart, I still think that it would be better to use a line graph so I did not incorporate this advice. Furthermore, I still felt that adding more statistical measures would rather complicate the graphs. So I decided to stick to the simple yet powerful graph (i.e. addressing what is really interesting to audiences).

**Refined version of the graph**
![changed_graph](https://s32.postimg.org/wduwirtat/changed_2.png)

**Refined version of the map**
![changed_map](https://s31.postimg.org/3nh06dmzv/changed_1.png)

###Resources

* [OECD Stat Database](http://stats.oecd.org/)

###Data

* data/oecd_migration.csv (data drawn from OECD stat database)
* data/world_countries.json (data used for rendering map using d3.geo.mercator)