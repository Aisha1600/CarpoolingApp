import psycopg2
import geopy.distance


# Connect to the Postgres database
conn = psycopg2.connect(
    host="localhost",
    database="carpool",
    user="postgres",
    password="vortex"
)

#temp
user_id = 6  # Replace with the actual user ID

# Open a cursor to perform database operations
cur = conn.cursor()

def calculate_distances(source_address, destination_address):
    if source_address == "123 Main St, Anytown, USA" and destination_address == "456 Elm St, Anytown, USA":
        return 2.5  # distance in km between the two addresses
    elif source_address == "789 Oak St, Anytown, USA" and destination_address == "456 Elm St, Anytown, USA":
        return 5.0  # distance in km between the two addresses
    else:
        return None  # unknown address pair


# Function to calculate the distance between two destinations
def calculate_distance(source_address, destination_address):
    source_coords = geopy.geocoders.Nominatim(user_agent="my-application").geocode(source_address)
    dest_coords = geopy.geocoders.Nominatim(user_agent="my-application").geocode(destination_address)
    source_lat, source_lon = source_coords.latitude, source_coords.longitude
    dest_lat, dest_lon = dest_coords.latitude, dest_coords.longitude
    distance_in_km = geopy.distance.distance((source_lat, source_lon), (dest_lat, dest_lon)).km
    return distance_in_km

# Get user's preferences
cur.execute("SELECT * FROM PREFERENCE WHERE MEMBER_ID = %s", (user_id,))
user_preferences = cur.fetchone()

# Get user's travel start time from ride table
cur.execute("SELECT r.travel_start_time FROM request req INNER JOIN ride r ON req.ride_id = r.ride_id WHERE req.member_id = %s ORDER BY req.created_on DESC LIMIT 1;", (user_id,))
#user_travel_start_time = cur.fetchone()[0]
#user_travel_start_time = None
result = cur.fetchone()
if result:
    user_travel_start_time = result[0]
else:
    user_travel_start_time = None
# Get user's most frequently traveled destination from destination table
cur.execute("SELECT D_NAME FROM REQUEST JOIN RIDE ON REQUEST.RIDE_ID = RIDE.RIDE_ID JOIN DESTINATION ON RIDE.DESTINATION_ID = DESTINATION.DESTINATION_ID WHERE REQUEST.MEMBER_ID = %s GROUP BY D_NAME ORDER BY COUNT(*) DESC LIMIT 1", (user_id,))
#user_frequent_destination = cur.fetchone()[0]
result_d = cur.fetchone()
if result_d is not None:
    user_frequent_destination = result[0]
else:
    # handle the case where no rows were returned
    user_frequent_destination = None
    

# Limit the number of rides retrieved based on distance from user's frequent destination
MAX_DISTANCE = 10 # in kilometers
cur.execute("SELECT r.* FROM ride r JOIN request req ON r.ride_id = req.ride_id WHERE req.member_id = %s", (user_id,))
all_rides = cur.fetchall()
rides_within_distance = []
for ride in all_rides:
    ride_distance = calculate_distances(user_frequent_destination, ride['DESTINATION_ADDRESS'])
    if ride_distance <= MAX_DISTANCE:
        rides_within_distance.append(ride)

# Calculate similarity scores for each ride and store them in a dictionary
scores = {}
for ride in all_rides:
    # Calculate similarity score based on preferences
    pref_score = 0
    if ride['IS_SMOKING_ALLOWED'] == user_preferences['IS_SMOKING_ALLOWED']:
        pref_score += 1
    if ride['IS_ALL_FEMALE'] == user_preferences['IS_ALL_FEMALE']:
        pref_score += 1

    # Calculate similarity score based on travel start time
    travel_start_time_score = 1 - abs((user_travel_start_time - ride['TRAVEL_START_TIME']).total_seconds())/(60*60)

    # Calculate similarity score based on most frequent destination
    frequent_destination_score = 0
    if ride['D_NAME'] == user_frequent_destination:
        frequent_destination_score += 1

    # Calculate overall similarity score as weighted sum of individual scores
    overall_score = pref_score * 0.4 + travel_start_time_score * 0.4 + frequent_destination_score * 0.2

    # Add score to the dictionary
    scores[ride['RIDE_ID']] = overall_score

# Sort the rides in descending order of similarity score
sorted_rides = sorted(scores.items(), key=lambda x: x[1], reverse=True)

# Recommend top 5 rides to the user
recommended_rides = []
for ride_id, score in sorted_rides[:5]:
    cur.execute("SELECT * FROM RIDE WHERE RIDE_ID = %s", (ride_id,))
    recommended_rides.append(cur.fetchone())

print(recommended_rides)

# Close the cursor and database connection
cur.close()
conn.close()
