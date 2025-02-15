
-- Clean up existing data
TRUNCATE fashion_trends, product_recommendations RESTART IDENTITY;

-- Insert fashion trends
INSERT INTO fashion_trends (title, description, category, season, image_url, source, valid_from, valid_to, created_at)
VALUES
  ('Coastal Grandma Style', 'Relaxed, elegant beachwear featuring linens and neutral tones', 'style_trend', 'spring', 'https://media.everlane.com/image/upload/c_fill,w_1080,ar_1:1,q_auto,dpr_1.0,g_face:center,f_auto,fl_progressive:steep/i/5c51c426_6053', 'Fashion Week Analysis', NOW(), NOW() + INTERVAL '3 months', NOW()),
  ('Digital Lavender', 'This soft purple hue dominates fashion and accessories', 'color_trend', 'spring', 'https://cdn.shopify.com/s/files/1/0059/5879/5337/files/spring-summer-2023-colour-trends-digital-lavender.jpg', 'Pantone Color Report', NOW(), NOW() + INTERVAL '4 months', NOW()),
  ('Sustainable Denim', 'Eco-friendly denim with minimal water usage and recycled materials', 'seasonal', 'all', 'https://lsco.scene7.com/is/image/lsco/A41780000-dynamic1-pdp?fmt=avif&qlt=40&resMode=bisharp&fit=crop,0&op_usm=0.6,0.6,8&wid=660&hei=660', 'Sustainability Report', NOW(), NOW() + INTERVAL '6 months', NOW());
