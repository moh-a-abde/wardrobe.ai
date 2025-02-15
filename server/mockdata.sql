
-- Clean up existing data
TRUNCATE fashion_trends RESTART IDENTITY;

-- Insert fashion trends
INSERT INTO fashion_trends (title, description, category, season, image_url, source, valid_from, valid_to, created_at)
VALUES
  ('Coastal Grandma Style', 'Relaxed, elegant beachwear featuring linens and neutral tones', 'style_trend', 'spring', 'https://media.everlane.com/image/upload/c_fill,w_1080,ar_1:1,q_auto,dpr_1.0,g_face:center,f_auto,fl_progressive:steep/i/5c51c426_6053', 'Fashion Week Analysis', NOW(), NOW() + INTERVAL '3 months', NOW()),
  ('Digital Lavender', 'This soft purple hue dominates fashion and accessories', 'color_trend', 'spring', 'https://cdn.shopify.com/s/files/1/0059/5879/5337/files/spring-summer-2023-colour-trends-digital-lavender.jpg', 'Pantone Color Report', NOW(), NOW() + INTERVAL '4 months', NOW()),
  ('Sustainable Denim', 'Eco-friendly denim with minimal water usage and recycled materials', 'seasonal', 'all', 'https://lsco.scene7.com/is/image/lsco/A41780000-dynamic1-pdp?fmt=avif&qlt=40&resMode=bisharp&fit=crop,0&op_usm=0.6,0.6,8&wid=660&hei=660', 'Sustainability Report', NOW(), NOW() + INTERVAL '6 months', NOW()),
  ('Y2K Revival', 'The return of low-rise jeans, crop tops, and platform shoes from the 2000s', 'style_trend', 'summer', 'https://images.asos-media.com/products/reclaimed-vintage-inspired-the-90s-baggy-jean-in-vintage-light-wash/203593671-1-vintagelightblue', 'Street Style Trends', NOW(), NOW() + INTERVAL '5 months', NOW()),
  ('Earth Tones', 'Warm, natural colors inspired by nature - browns, beiges, and olive greens', 'color_trend', 'fall', 'https://media.zara.net/photos///2024/V/0/1/p/3046/024/505/2/w/563/3046024505_2_1_1.jpg', 'Designer Collections', NOW(), NOW() + INTERVAL '4 months', NOW()),
  ('Oversized Blazers', 'Relaxed-fit blazers paired with casual wear for a modern look', 'style_trend', 'spring', 'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fff%2F55%2Fff55f85593a1c0b57939d82c899faa0fa5800abc.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]', 'Fashion Week', NOW(), NOW() + INTERVAL '3 months', NOW()),
  ('Crochet Everything', 'Handcrafted crochet pieces from tops to accessories', 'seasonal', 'summer', 'https://www.zara.com/images/ss24/collection/woman/trend/crochet.jpg', 'Summer Forecast', NOW(), NOW() + INTERVAL '4 months', NOW()),
  ('Metallic Accents', 'Subtle metallic details adding glamour to everyday wear', 'style_trend', 'winter', 'https://static.zara.net/photos///2024/V/0/1/p/2969/051/808/2/w/563/2969051808_1_1_1.jpg', 'Evening Wear Trends', NOW(), NOW() + INTERVAL '3 months', NOW());
