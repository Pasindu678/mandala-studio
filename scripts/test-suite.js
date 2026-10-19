/**
 * Mandala Studio — Automated Integration & Verification Test Suite
 * Tests DB integrity, Auth, Cart Recalculation, Discounts, Checkout, Entitlements, and Download Protection
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('   MANDALA STUDIO — AUTOMATED TEST SUITE');
  console.log(`   Target Server: ${BASE_URL}`);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // 1. Database Integrity Checks
    console.log('[1/6] Database Model & Seed Verification:');
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@mandalastudio.art' } });
    assert(adminUser && adminUser.role === 'ADMIN', 'Admin user exists with role ADMIN');

    const customerUser = await prisma.user.findUnique({ where: { email: 'customer@example.com' } });
    assert(customerUser && customerUser.role === 'CUSTOMER', 'Customer user exists with role CUSTOMER');

    const categoryCount = await prisma.category.count();
    assert(categoryCount >= 8, `Categories seeded count (${categoryCount}) >= 8`);

    const artworkCount = await prisma.artwork.count();
    assert(artworkCount >= 24, `Artworks seeded count (${artworkCount}) >= 24`);

    const productCount = await prisma.product.count();
    assert(productCount >= 4, `Commercial products seeded count (${productCount}) >= 4`);

    const discountCount = await prisma.discountCode.count();
    assert(discountCount >= 3, `Discount codes seeded count (${discountCount}) >= 3`);

    const contentCount = await prisma.websiteContent.count();
    assert(contentCount >= 5, `CMS Website content sections count (${contentCount}) >= 5`);

    // 2. Public Pages HTTP 200 Checks
    console.log('\n[2/6] Public Frontend Routing Verification:');
    const routesToTest = [
      '/',
      '/gallery',
      '/shop',
      '/cart',
      '/categories/ceylon-moonstone-heritage',
      '/artwork/sandakada-pahana-sacred-moonstone',
      '/login',
      '/register'
    ];

    for (const route of routesToTest) {
      try {
        const res = await fetch(`${BASE_URL}${route}`);
        assert(res.status === 200, `Route ${route} returned HTTP 200 (Got: ${res.status})`);
      } catch (err) {
        assert(false, `Route ${route} fetch failed`, err.message);
      }
    }

    // 3. Cart Recalculation & Discount Logic Checks
    console.log('\n[3/6] Strict Server-Side Cart Recalculation & Discounts:');
    const samplePaidArtwork = await prisma.artwork.findFirst({
      where: { isFree: false, isPublished: true, isArchived: false }
    });

    const sampleProduct = await prisma.product.findFirst({
      where: { isPublished: true }
    });

    assert(Boolean(samplePaidArtwork), 'Found published paid artwork in database');
    assert(Boolean(sampleProduct), 'Found published product in database');

    const cartPayload = {
      items: [
        { id: samplePaidArtwork.id, type: 'artwork' },
        { id: sampleProduct.id, type: 'product' }
      ],
      discountCode: 'MANDALA10'
    };

    const cartRes = await fetch(`${BASE_URL}/api/cart/recalculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartPayload)
    });
    const cartData = await cartRes.json();

    const expectedSubtotal = Number((samplePaidArtwork.price + sampleProduct.price).toFixed(2));
    const expectedDiscount = Number(((expectedSubtotal * 10) / 100).toFixed(2));
    const expectedTotal = Number((expectedSubtotal - expectedDiscount).toFixed(2));

    assert(cartData.subtotal === expectedSubtotal, `Subtotal verified ($${cartData.subtotal} == $${expectedSubtotal})`);
    assert(cartData.discountAmount === expectedDiscount, `10% Discount verified ($${cartData.discountAmount} == $${expectedDiscount})`);
    assert(cartData.total === expectedTotal, `Final recalculated total verified ($${cartData.total} == $${expectedTotal})`);
    assert(cartData.discountCodeApplied === 'MANDALA10', 'Discount code MANDALA10 successfully applied');

    // 4. Discount Code Validation API
    console.log('\n[4/6] Discount Validation Endpoint:');
    const discValidRes = await fetch(`${BASE_URL}/api/discounts/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'ZEN20', cartSubtotal: 50 })
    });
    const discValidData = await discValidRes.json();
    assert(discValidData.valid === true, 'Discount ZEN20 is valid for $50 subtotal');
    assert(discValidData.percentage === 20, 'ZEN20 percentage is 20%');

    const discInvalidRes = await fetch(`${BASE_URL}/api/discounts/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'ZEN20', cartSubtotal: 5 })
    });
    const discInvalidData = await discInvalidRes.json();
    assert(discInvalidData.valid === false, 'ZEN20 is rejected when subtotal is below minimum order amount');

    // 5. Checkout & Digital Purchase Fulfillment
    console.log('\n[5/6] Checkout & Digital Purchase Fulfillment:');
    const sessionRes = await fetch(`${BASE_URL}/api/checkout/create-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerEmail: 'test-buyer@mandalastudio.art',
        customerName: 'Test Buyer',
        items: [
          { id: samplePaidArtwork.id, type: 'artwork' }
        ],
        discountCode: 'MANDALA10'
      })
    });
    const sessionData = await sessionRes.json();
    assert(sessionData.success === true, 'Checkout session created successfully');
    assert(Boolean(sessionData.orderNumber), `Order number generated (${sessionData.orderNumber})`);

    const mockCompleteRes = await fetch(`${BASE_URL}/api/checkout/mock-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: sessionData.orderNumber
      })
    });
    const mockCompleteData = await mockCompleteRes.json();
    assert(mockCompleteData.success === true, 'Sandbox payment completion succeeded');

    // Retrieve order entitlements
    const orderWithEntitlements = await prisma.order.findUnique({
      where: { orderNumber: sessionData.orderNumber },
      include: { entitlements: true }
    });

    assert(orderWithEntitlements && orderWithEntitlements.status === 'COMPLETED', 'Order status marked COMPLETED');
    assert(orderWithEntitlements.entitlements.length === 1, 'Entitlement generated for purchased artwork');

    const entitlementId = orderWithEntitlements.entitlements[0].id;

    // 6. Secure Download Protection
    console.log('\n[6/6] Secure Download Entitlement Verification:');
    // An invalid entitlement ID should return 404
    const invalidDownloadRes = await fetch(`${BASE_URL}/api/downloads/non-existent-entitlement-id`);
    assert(invalidDownloadRes.status === 404, 'Non-existent entitlement is blocked with 404 Not Found');

    // A valid entitlement ID should return 200 with proper file streaming headers
    const validDownloadRes = await fetch(`${BASE_URL}/api/downloads/${entitlementId}`);
    assert(validDownloadRes.status === 200, `Valid entitlement stream returned HTTP 200 (Got: ${validDownloadRes.status})`);
    const contentType = validDownloadRes.headers.get('content-type') || '';
    assert(contentType.includes('image/svg+xml') || contentType.includes('application/octet-stream'), `File Content-Type valid (${contentType})`);

    // Verify download count incremented
    const updatedEntitlement = await prisma.purchaseEntitlement.findUnique({
      where: { id: entitlementId }
    });
    assert(updatedEntitlement && updatedEntitlement.downloadCount === 1, `Entitlement download count incremented to 1 (max: ${updatedEntitlement.maxDownloads})`);

  } catch (err) {
    console.error('Test Suite encountered an unexpected error:', err);
    failed++;
  } finally {
    console.log('\n====================================================');
    console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
    await prisma.$disconnect();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
