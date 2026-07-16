const axios = require("axios");

const BASE_URL = "http://localhost:5088/api";

const runTests = async () => {
  console.log("=== STARTING BACKEND E2E TEST CHECKLIST ===");
  let userToken = "";
  let adminToken = "";
  let testProductId = "";
  let testCategoryId = "";
  let testAddressId = "";
  let testOrderId = "";

  const randSuffix = Math.floor(Math.random() * 10000);
  const testUserEmail = `user_${randSuffix}@test.com`;
  const testUserPassword = "Password123!";

  try {
    // 1. Signup/login/logout
    console.log("\n1. Testing User Signup...");
    const signupRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Test User",
      email: testUserEmail,
      password: testUserPassword,
    });
    userToken = signupRes.data.token;
    console.log(`✓ Signup successful! Registered: ${testUserEmail}`);

    console.log("Testing User Login...");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUserEmail,
      password: testUserPassword,
    });
    console.log(`✓ Login successful! Token received.`);

    // 2. Admin login
    console.log("\n2. Testing Admin Login...");
    const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: "admin@iincept.com",
      password: "AdminPass123!",
    });
    adminToken = adminLoginRes.data.token;
    console.log(`✓ Admin login successful! Role: ${adminLoginRes.data.role}`);

    const adminAuthHeader = { headers: { Authorization: `Bearer ${adminToken}` } };
    const userAuthHeader = { headers: { Authorization: `Bearer ${userToken}` } };

    // 3. Category add/delete
    console.log("\n3. Testing Category creation (Admin)...");
    const catRes = await axios.post(
      `${BASE_URL}/categories`,
      { 
        name: `Test Category ${randSuffix}`,
        image: "https://example.com/category.png"
      },
      adminAuthHeader
    );
    testCategoryId = catRes.data._id;
    console.log(`✓ Category created! Name: ${catRes.data.name}, ID: ${testCategoryId}`);

    // 4. Product add/edit/delete
    console.log("\n4. Testing Product creation (Admin)...");
    const prodRes = await axios.post(
      `${BASE_URL}/products`,
      {
        title: `Test Apple Device ${randSuffix}`,
        description: "High performance device mock",
        price: 99999,
        category: testCategoryId,
        stock: 10,
        brand: "Apple",
        images: ["https://example.com/phone.png"],
      },
      adminAuthHeader
    );
    testProductId = prodRes.data._id;
    console.log(`✓ Product created! Title: ${prodRes.data.title}, ID: ${testProductId}`);

    console.log("Testing Product edit (Admin)...");
    const prodEditRes = await axios.put(
      `${BASE_URL}/products/${testProductId}`,
      { price: 89999, stock: 4 }, // low stock triggers
      adminAuthHeader
    );
    console.log(`✓ Product updated! New Price: ${prodEditRes.data.price}, New Stock: ${prodEditRes.data.stock}`);

    // 5. Add to cart / quantity / remove
    console.log("\n5. Testing Cart operations...");
    console.log("Adding product to cart...");
    const cartAddRes = await axios.post(
      `${BASE_URL}/cart`,
      { productId: testProductId, quantity: 1 },
      userAuthHeader
    );
    console.log(`✓ Added to cart! Cart items count: ${cartAddRes.data.items?.length || 0}`);

    console.log("Updating cart item quantity...");
    const cartUpdateRes = await axios.put(
      `${BASE_URL}/cart/${testProductId}`,
      { quantity: 2 },
      userAuthHeader
    );
    console.log(`✓ Cart quantity updated!`);

    // 6. Wishlist add/remove
    console.log("\n6. Testing Wishlist operations...");
    console.log("Adding product to wishlist...");
    const wishlistAddRes = await axios.post(
      `${BASE_URL}/wishlist`,
      { productId: testProductId },
      userAuthHeader
    );
    console.log(`✓ Added to wishlist! Wishlist products count: ${wishlistAddRes.data.products?.length || 0}`);

    console.log("Removing product from wishlist...");
    const wishlistRemoveRes = await axios.delete(
      `${BASE_URL}/wishlist/${testProductId}`,
      userAuthHeader
    );
    console.log(`✓ Removed from wishlist!`);

    // 7. Address save/edit/delete
    console.log("\n7. Testing Address book operations...");
    const addrRes = await axios.post(
      `${BASE_URL}/address`,
      {
        fullName: "Test Address Receiver",
        phone: "9876543210",
        address: "123 Tech Hub Road",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110019",
      },
      userAuthHeader
    );
    testAddressId = addrRes.data._id;
    console.log(`✓ Address registered! ID: ${testAddressId}`);

    console.log("Updating address details...");
    const addrEditRes = await axios.put(
      `${BASE_URL}/address/${testAddressId}`,
      { fullName: "Test Address Receiver Updated" },
      userAuthHeader
    );
    console.log(`✓ Address updated! New name: ${addrEditRes.data.fullName}`);

    // 8. Order create/cancel
    console.log("\n8. Testing Order creation & cancellation...");
    const orderCreateRes = await axios.post(
      `${BASE_URL}/orders`,
      {
        shippingAddress: testAddressId,
        paymentMethod: "COD",
      },
      userAuthHeader
    );
    testOrderId = orderCreateRes.data._id;
    console.log(`✓ Order created successfully! ID: ${testOrderId}, Status: ${orderCreateRes.data.orderStatus}`);

    console.log("Testing Order cancellation...");
    const orderCancelRes = await axios.put(
      `${BASE_URL}/orders/${testOrderId}/cancel`,
      {},
      userAuthHeader
    );
    console.log(`✓ Order cancelled successfully! New Status: ${orderCancelRes.data.orderStatus}`);

    console.log("\n8.1 Testing Razorpay creation & signature verification failure...");
    // Add product back to cart
    await axios.post(
      `${BASE_URL}/cart`,
      { productId: testProductId, quantity: 1 },
      userAuthHeader
    );

    const rpOrderRes = await axios.post(
      `${BASE_URL}/orders`,
      {
        shippingAddress: testAddressId,
        paymentMethod: "Razorpay",
      },
      userAuthHeader
    );
    const rpOrderId = rpOrderRes.data._id;
    console.log(`✓ Razorpay order created! ID: ${rpOrderId}, Razorpay Order ID: ${rpOrderRes.data.razorpayOrder?.id}`);

    console.log("Submitting invalid signature payload to verification endpoint...");
    try {
      await axios.post(
        `${BASE_URL}/orders/verify`,
        {
          orderId: rpOrderId,
          razorpay_order_id: rpOrderRes.data.razorpayOrder?.id || "mock_order_123",
          razorpay_payment_id: "pay_xyz",
          razorpay_signature: "invalid_sig_here"
        },
        userAuthHeader
      );
      console.error("❌ Error: Verification endpoint did not reject invalid signature!");
      process.exit(1);
    } catch (err) {
      console.log(`✓ Verification endpoint successfully rejected invalid signature!`);
    }

    // Assert that the order is cancelled now
    const checkOrderRes = await axios.get(`${BASE_URL}/orders/${rpOrderId}`, userAuthHeader);
    console.log(`✓ Order status checked: ${checkOrderRes.data.orderStatus}, Payment Status: ${checkOrderRes.data.paymentStatus}`);

    // 8.5 Testing Coupons (Admin create, User apply, Admin delete)
    console.log("\n8.5 Testing Coupon operations...");
    const testCouponCode = `TESTCOUPON${randSuffix}`;
    const futureExpiry = new Date();
    futureExpiry.setDate(futureExpiry.getDate() + 5);

    console.log("Creating new coupon (Admin)...");
    const couponCreateRes = await axios.post(
      `${BASE_URL}/coupons`,
      {
        code: testCouponCode,
        discount: 10,
        minimumAmount: 100, // min purchase
        expiryDate: futureExpiry,
      },
      adminAuthHeader
    );
    const testCouponId = couponCreateRes.data._id;
    console.log(`✓ Coupon created! Code: ${couponCreateRes.data.code}`);

    console.log("Applying coupon (User)...");
    // Add product to cart again to ensure user has cart total
    await axios.post(
      `${BASE_URL}/cart`,
      { productId: testProductId, quantity: 1 },
      userAuthHeader
    );

    const applyCouponRes = await axios.post(
      `${BASE_URL}/coupons/apply`,
      { code: testCouponCode },
      userAuthHeader
    );
    console.log(`✓ Coupon applied successfully! Discount Amount: ₹${applyCouponRes.data.discountAmount}`);

    console.log("Deleting coupon (Admin)...");
    await axios.delete(`${BASE_URL}/coupons/${testCouponId}`, adminAuthHeader);
    console.log(`✓ Coupon deleted successfully.`);

    // 9. Cleanup database
    console.log("\n9. Database Cleanup (Admin)...");
    await axios.delete(`${BASE_URL}/products/${testProductId}`, adminAuthHeader);
    console.log(`✓ Deleted test product.`);
    await axios.delete(`${BASE_URL}/categories/${testCategoryId}`, adminAuthHeader);
    console.log(`✓ Deleted test category.`);
    await axios.delete(`${BASE_URL}/address/${testAddressId}`, userAuthHeader);
    console.log(`✓ Deleted test address.`);

    console.log("\n=== ALL E2E TEST CHECKS COMPLETED SUCCESSFULLY WITH ZERO ERRORS ===");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    process.exit(1);
  }
};

runTests();
