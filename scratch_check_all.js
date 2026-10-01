const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_BASE = 'http://localhost:5088/api';

// Colors for output
const logPass = (msg) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
const logFail = (msg, detail) => console.log(`\x1b[31m[FAIL]\x1b[0m ${msg} =>`, detail);
const logInfo = (msg) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`);

const testResults = [];

function recordResult(section, testName, passed, details = null) {
  testResults.push({ section, testName, passed, details });
  if (passed) {
    logPass(`[${section}] ${testName}`);
  } else {
    logFail(`[${section}] ${testName}`, details);
  }
}

async function runAudit() {
  console.log("==================================================");
  console.log("  STARTING COMPREHENSIVE BACKEND AUDIT & TESTING  ");
  console.log("==================================================\n");

  let userToken = '';
  let adminToken = '';
  let testUserId = '';
  let createdProductId = '';
  let createdCategoryId = '';
  let createdCouponId = '';

  const testUserEmail = `audit_test_user_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  // 1. BUILD / STARTUP & DB CHECK
  try {
    const res = await axios.get(`${API_BASE}/products?limit=1`);
    if (res.status === 200) {
      recordResult("1. Startup", "Server responsiveness check", true);
    } else {
      recordResult("1. Startup", "Server responsiveness check", false, `Status ${res.status}`);
    }
  } catch (err) {
    recordResult("1. Startup", "Server responsiveness check", false, err.message);
  }

  // Direct Mongoose collection audit
  try {
    const localUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce17';
    await mongoose.connect(localUri);
    const dbName = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db.listCollections().toArray();
    recordResult("2. DB Test", `Database connection to ${dbName}`, true, `Found ${collections.length} collections`);
    await mongoose.disconnect();
  } catch (err) {
    recordResult("2. DB Test", "Database connection check", false, err.message);
  }

  // 3. AUTH API TEST
  // 3a. Register user
  try {
    const res = await axios.post(`${API_BASE}/auth/register`, {
      name: "Audit User",
      email: testUserEmail,
      password: testPassword
    });
    if (res.status === 201 && res.data.token) {
      userToken = res.data.token;
      testUserId = res.data._id || res.data.user?._id;
      recordResult("3. Auth API", "POST /auth/register with valid credentials", true);
    } else {
      recordResult("3. Auth API", "POST /auth/register with valid credentials", false, res.data);
    }
  } catch (err) {
    recordResult("3. Auth API", "POST /auth/register with valid credentials", false, err.response?.data || err.message);
  }

  // 3b. Duplicate registration
  try {
    await axios.post(`${API_BASE}/auth/register`, {
      name: "Audit User",
      email: testUserEmail,
      password: testPassword
    });
    recordResult("3. Auth API", "POST /auth/register duplicate email rejection", false, "Allowed duplicate email");
  } catch (err) {
    if (err.response && err.response.status >= 400) {
      recordResult("3. Auth API", "POST /auth/register duplicate email rejection", true, `Returned ${err.response.status}`);
    } else {
      recordResult("3. Auth API", "POST /auth/register duplicate email rejection", false, err.message);
    }
  }

  // 3c. Login user
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: testUserEmail,
      password: testPassword
    });
    if (res.status === 200 && res.data.token) {
      userToken = res.data.token;
      recordResult("3. Auth API", "POST /auth/login valid credentials", true);
    } else {
      recordResult("3. Auth API", "POST /auth/login valid credentials", false, res.data);
    }
  } catch (err) {
    recordResult("3. Auth API", "POST /auth/login valid credentials", false, err.response?.data || err.message);
  }

  // 3d. Login invalid password
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: testUserEmail,
      password: 'WrongPassword'
    });
    recordResult("3. Auth API", "POST /auth/login invalid credentials rejection", false, "Allowed invalid password");
  } catch (err) {
    if (err.response && (err.response.status === 400 || err.response.status === 401)) {
      recordResult("3. Auth API", "POST /auth/login invalid credentials rejection", true, `Returned ${err.response.status}`);
    } else {
      recordResult("3. Auth API", "POST /auth/login invalid credentials rejection", false, err.message);
    }
  }

  // 3e. Login Admin to get Admin Token
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: "admin@example.com",
      password: "adminpassword"
    });
    if (res.status === 200 && res.data.token) {
      adminToken = res.data.token;
      recordResult("3. Auth API", "POST /auth/login admin credentials", true);
    } else {
      recordResult("3. Auth API", "POST /auth/login admin credentials", false, "Admin token missing");
    }
  } catch (err) {
    // Try creating admin if default doesn't exist
    recordResult("3. Auth API", "POST /auth/login admin credentials", false, err.response?.data || err.message);
  }

  // 3f. GET /auth/profile
  try {
    const res = await axios.get(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (res.status === 200 && res.data.email === testUserEmail) {
      recordResult("3. Auth API", "GET /auth/profile with valid token", true);
    } else {
      recordResult("3. Auth API", "GET /auth/profile with valid token", false, res.data);
    }
  } catch (err) {
    recordResult("3. Auth API", "GET /auth/profile with valid token", false, err.response?.data || err.message);
  }

  // 3g. GET /auth/profile invalid token
  try {
    await axios.get(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer invalid_token_123` }
    });
    recordResult("3. Auth API", "GET /auth/profile invalid token rejection", false, "Allowed invalid token");
  } catch (err) {
    if (err.response && err.response.status === 401) {
      recordResult("3. Auth API", "GET /auth/profile invalid token rejection", true);
    } else {
      recordResult("3. Auth API", "GET /auth/profile invalid token rejection", false, `Status ${err.response?.status}`);
    }
  }

  // 4. PRODUCT API TEST
  try {
    const res = await axios.get(`${API_BASE}/products`);
    if (res.status === 200 && Array.isArray(res.data.products || res.data)) {
      recordResult("4. Product API", "GET /products", true, `Returned ${(res.data.products || res.data).length} products`);
    } else {
      recordResult("4. Product API", "GET /products", false, res.data);
    }
  } catch (err) {
    recordResult("4. Product API", "GET /products", false, err.response?.data || err.message);
  }

  // 4b. GET /products with search & filter
  try {
    const res = await axios.get(`${API_BASE}/products?search=MacBook&limit=5`);
    if (res.status === 200) {
      recordResult("4. Product API", "GET /products search & pagination", true);
    } else {
      recordResult("4. Product API", "GET /products search & pagination", false, res.data);
    }
  } catch (err) {
    recordResult("4. Product API", "GET /products search & pagination", false, err.response?.data || err.message);
  }

  // 4c. POST /products (Admin creation test)
  if (adminToken) {
    try {
      const res = await axios.post(`${API_BASE}/products`, {
        name: "Test Audit Product",
        title: "Test Audit Product",
        price: 99999,
        discountPrice: 10,
        stock: 50,
        category: "mac",
        description: "Audit test description"
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status === 201 && (res.data._id || res.data.product?._id)) {
        createdProductId = res.data._id || res.data.product?._id;
        recordResult("4. Product API", "POST /products admin creation", true);
      } else {
        recordResult("4. Product API", "POST /products admin creation", false, res.data);
      }
    } catch (err) {
      recordResult("4. Product API", "POST /products admin creation", false, err.response?.data || err.message);
    }
  }

  // 4d. POST /products as Normal User (Security Check)
  try {
    await axios.post(`${API_BASE}/products`, {
      name: "Unauthorized Product",
      price: 1000
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    recordResult("9. Admin Security", "POST /products by normal user block", false, "Normal user was able to create product!");
  } catch (err) {
    if (err.response && (err.response.status === 403 || err.response.status === 401)) {
      recordResult("9. Admin Security", "POST /products by normal user block", true, `Returned ${err.response.status}`);
    } else {
      recordResult("9. Admin Security", "POST /products by normal user block", false, err.response?.data || err.message);
    }
  }

  // 5. CATEGORY API TEST
  try {
    const res = await axios.get(`${API_BASE}/categories`);
    if (res.status === 200 && Array.isArray(res.data)) {
      recordResult("5. Category API", "GET /categories", true, `Returned ${res.data.length} categories`);
    } else {
      recordResult("5. Category API", "GET /categories", false, res.data);
    }
  } catch (err) {
    recordResult("5. Category API", "GET /categories", false, err.response?.data || err.message);
  }

  // 6. CART API TEST
  // 6a. GET Cart
  try {
    const res = await axios.get(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (res.status === 200) {
      recordResult("6. Cart API", "GET /cart for logged in user", true);
    } else {
      recordResult("6. Cart API", "GET /cart for logged in user", false, res.data);
    }
  } catch (err) {
    recordResult("6. Cart API", "GET /cart for logged in user", false, err.response?.data || err.message);
  }

  // 6b. Add to cart
  if (createdProductId) {
    try {
      const res = await axios.post(`${API_BASE}/cart`, {
        productId: createdProductId,
        quantity: 2
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (res.status === 200 || res.status === 201) {
        recordResult("6. Cart API", "POST /cart add item", true);
      } else {
        recordResult("6. Cart API", "POST /cart add item", false, res.data);
      }
    } catch (err) {
      recordResult("6. Cart API", "POST /cart add item", false, err.response?.data || err.message);
    }
  }

  // 7. WISHLIST API TEST
  try {
    const res = await axios.get(`${API_BASE}/wishlist`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (res.status === 200) {
      recordResult("7. Wishlist API", "GET /wishlist for user", true);
    } else {
      recordResult("7. Wishlist API", "GET /wishlist for user", false, res.data);
    }
  } catch (err) {
    recordResult("7. Wishlist API", "GET /wishlist for user", false, err.response?.data || err.message);
  }

  if (createdProductId) {
    try {
      const res = await axios.post(`${API_BASE}/wishlist`, {
        productId: createdProductId
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (res.status === 200 || res.status === 201) {
        recordResult("7. Wishlist API", "POST /wishlist add item", true);
      } else {
        recordResult("7. Wishlist API", "POST /wishlist add item", false, res.data);
      }
    } catch (err) {
      recordResult("7. Wishlist API", "POST /wishlist add item", false, err.response?.data || err.message);
    }
  }

  // 8. ORDER API TEST
  try {
    const res = await axios.get(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (res.status === 200 && Array.isArray(res.data)) {
      recordResult("8. Order API", "GET /orders for user", true);
    } else {
      recordResult("8. Order API", "GET /orders for user", false, res.data);
    }
  } catch (err) {
    recordResult("8. Order API", "GET /orders for user", false, err.response?.data || err.message);
  }

  // 10. INPUT VALIDATION TEST (Invalid ObjectId)
  try {
    await axios.get(`${API_BASE}/products/invalid-object-id-12345`);
    recordResult("10. Validation", "GET /products/:id invalid ObjectId handling", false, "Returned 200 for invalid ID");
  } catch (err) {
    if (err.response && (err.response.status === 400 || err.response.status === 404 || err.response.status === 500)) {
      recordResult("10. Validation", "GET /products/:id invalid ObjectId handling", true, `Returned ${err.response.status}`);
    } else {
      recordResult("10. Validation", "GET /products/:id invalid ObjectId handling", false, err.message);
    }
  }

  // Clean up created test product if any
  if (createdProductId && adminToken) {
    try {
      await axios.delete(`${API_BASE}/products/${createdProductId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      logInfo(`Cleaned up test product ${createdProductId}`);
    } catch (err) {
      logInfo(`Cleanup note: could not delete test product ${createdProductId}`);
    }
  }

  console.log("\n==================================================");
  console.log("               AUDIT SUMMARY TABLE                ");
  console.log("==================================================");
  console.table(testResults);
}

runAudit();
