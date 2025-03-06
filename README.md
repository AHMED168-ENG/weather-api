# Weather API

## 📌 Description

A high-performance weather API built with **Node.js (TypeScript) + Express.js** and **MongoDB**, featuring:

- Scalable architecture with **Redis caching**
- Authentication using **JWT**
- Unit tests with **Jest** (85%+ coverage)
- Load testing to support **100k concurrent users**
- API documentation using **Postman**

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AHMED168-ENG/weather-api.git
cd weather-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/weatherDB
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
WEATHER_API_KEY=your_api_key
```

### 4️⃣ Run the Application

```bash
npm start
```

OR (for development with auto-restart)

```bash
npm run dev
```

---

## 🔥 API Endpoints

### 📍 Weather

- **`GET /weather/city/:city`** → Fetch weather data for a city
- **`GET /weather/coords?lat=X&lon=Y`** → Fetch weather data using coordinates

### 🔑 Authentication

- **`POST /auth/register`** → User registration
- **`POST /auth/login`** → User login (returns JWT token)

### ⭐ Favorites

- **`POST /favorites`** → Add a city to favorites
- **`GET /favorites`** → List favorite cities
- **`DELETE /favorites/:city`** → Remove a city from favorites

---

## 🧪 Running Tests & Code Coverage

Run unit tests with Jest:

```bash
npm test -- --coverage --detectOpenHandles
```

✅ Ensures 85%+ test coverage across **services, controllers, and utilities**.

---

## 📊 Load Testing (100K Users)

Using **k6**, simulate concurrent requests:

```bash
k6 run loadTest.js
```

➡ Generates a performance report validating **scalability & response times**.

---

## 📖 API Documentation

OR use the **Postman Collection**: [Postman Link](#)

---

## 📺 Demo & Screenshots

- **Postman screenshots** showcasing working API.
- **Demo video** available at: [YouTube Link](#)

---

## 🛠 Code Quality Checklist

✔ Follows **Clean Code & Best Practices**
✔ Uses **TypeScript typings & OOP principles**
✔ Implements **caching, authentication, and security measures**
✔ **85%+ Code Coverage** with Jest
✔ **Scalable architecture** for high-performance

---

## 📌 Contributing

Feel free to submit issues or pull requests to enhance this project!

---

## 📜 License

This project is **MIT Licensed**. See the [LICENSE](LICENSE) file for details.
