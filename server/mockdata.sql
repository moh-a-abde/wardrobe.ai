
-- Clean up existing data
TRUNCATE fashion_trends, product_recommendations RESTART IDENTITY;

-- Insert fashion trends
INSERT INTO fashion_trends (title, description, category, season, image_url, source, valid_from, valid_to, created_at)
VALUES
  ('Coastal Grandma Style', 'Relaxed, elegant beachwear featuring linens and neutral tones', 'style_trend', 'spring', 'https://media.everlane.com/image/upload/c_fill,w_1080,ar_1:1,q_auto,dpr_1.0,g_face:center,f_auto,fl_progressive:steep/i/5c51c426_6053', 'Fashion Week Analysis', NOW(), NOW() + INTERVAL '3 months', NOW()),
  ('Digital Lavender', 'This soft purple hue dominates fashion and accessories', 'color_trend', 'spring', 'https://cdn.shopify.com/s/files/1/0059/5879/5337/files/spring-summer-2023-colour-trends-digital-lavender.jpg', 'Pantone Color Report', NOW(), NOW() + INTERVAL '4 months', NOW()),
  ('Sustainable Denim', 'Eco-friendly denim with minimal water usage and recycled materials', 'seasonal', 'all', 'https://lsco.scene7.com/is/image/lsco/A41780000-dynamic1-pdp?fmt=avif&qlt=40&resMode=bisharp&fit=crop,0&op_usm=0.6,0.6,8&wid=660&hei=660', 'Sustainability Report', NOW(), NOW() + INTERVAL '6 months', NOW());

-- Insert product recommendations
INSERT INTO product_recommendations (name, type, color, price, image_url, product_url, reason, category, created_at)
VALUES
  ('Levi''s 501 Original Fit Jeans', 'pants', 'blue', '98.00', 'https://lsco.scene7.com/is/image/lsco/005010194-front-pdp', 'https://www.levis.com/501-original-fit', 'Perfect everyday denim', 'wardrobe_gap', NOW()),
  ('The North Face ThermoBall Eco Snow Triclimate Jacket', 'jacket', 'black', '250.00', 'https://images.thenorthface.com/is/image/TheNorthFace/NF0A5GLL_JK3_hero', 'https://www.thenorthface.com', 'Essential winter layering piece', 'style_match', NOW()),
  ('Carhartt WIP Nimbus Pullover Hoodie', 'shirt', 'grey', '120.00', 'https://cdn.carhartt-wip.com/is/image/carhartt/I028435_89_00-HL-01', 'https://www.carhartt-wip.com', 'Versatile casual essential', 'trend', NOW());
