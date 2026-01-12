# Property Search Application

### How to Run

### Steps
1. Navigate to the project root directory.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Once the containers are running:
   - **Frontend**: Access at [http://localhost:8080](http://localhost:8080)
   - **Backend API**: Accessible at [http://localhost:3000](http://localhost:3000)
   - **Database**: Exposed on port `5555`

---

### Features Implemented

Implemented features requested in the assignment:

1.  **List All Properties**:
    - GET /properties
    - Fetches and displays all properties and details including Property ID, Longitude, and Latitude.
    - Returns the properties in a JSON format.

2.  **Property Detail Page**:
    - Displays property metadata and the google map image.
    - Returns the property in a JSON format.

3.  **Search by Coordinates**:
    - POST /find
    - allows users to input Longitude, Latitude, and a custom Radius (defaulting to 10km).
    - Returns all matching properties sorted by distance.
    - using PostGIS.
    - Returns the properties in a JSON format.

4.  **Image Overlays**:
    - GET /display/:id
    - Supports custom colors via query parameters (e.g., `?overlay=yes&parcel=orange&building=green`).
    - Returns the image with the specified overlays.

---

### Assumptions
- **API Constraints**: Assumed the provided API `list-all` endpoint was the only available method for fetching property data, necessitating client-side filtering for the details view.
- **Geospatial Defaults**: Assumed a 10km radius is a reasonable default search area for finding nearby properties when no radius is specified.
- **Containerization**: Assumed the reviewer prefers a fully self-contained environment, so I configured Docker Compose to automatically seed the PostgreSQL database upon startup using the provided SQL files.

---