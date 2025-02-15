
-- Clean up existing data
TRUNCATE fashion_trends, product_recommendations RESTART IDENTITY;

-- Insert fashion trends
INSERT INTO fashion_trends (title, description, category, season, image_url, source, valid_from, valid_to, created_at)
VALUES
  ('Coastal Grandma Style', 'Relaxed, elegant beachwear featuring linens and neutral tones', 'style_trend', 'spring', 'https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/avatars/01.png', 'Fashion Week Analysis', NOW(), NOW() + INTERVAL '3 months', NOW()),
  ('Digital Lavender', 'This soft purple hue dominates fashion and accessories', 'color_trend', 'spring', 'https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/avatars/02.png', 'Pantone Color Report', NOW(), NOW() + INTERVAL '4 months', NOW()),
  ('Sustainable Denim', 'Eco-friendly denim with minimal water usage and recycled materials', 'seasonal', 'all', 'https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/avatars/03.png', 'Sustainability Report', NOW(), NOW() + INTERVAL '6 months', NOW());

-- Insert product recommendations
INSERT INTO product_recommendations (name, type, color, price, image_url, product_url, reason, category, created_at)
VALUES
  ('Linen Blazer', 'jacket', 'beige', '129.99', 'https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/avatars/04.png', 'https://example.com/shop', 'Perfect for the Coastal Grandma trend', 'style_match', NOW()),
  ('Lavender Sweater', 'sweater', 'purple', '59.99', 'https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/avatars/05.png', 'https://example.com/shop', 'Matches current color trends', 'trend', NOW()),
  ('Recycled Denim Jeans', 'pants', 'blue', '89.99', 'https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/avatars/06.png', 'https://example.com/shop', 'Sustainable wardrobe essential', 'wardrobe_gap', NOW());
