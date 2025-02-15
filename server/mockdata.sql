
-- Insert fashion trends
INSERT INTO fashion_trends (title, description, category, season, image_url, source, valid_from, valid_to)
VALUES
  ('Coastal Grandma Style', 'Relaxed, elegant beachwear featuring linens and neutral tones', 'style_trend', 'spring', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b', 'Fashion Week Analysis', '2024-02-01', '2024-05-01'),
  ('Digital Lavender', 'This soft purple hue dominates fashion and accessories', 'color_trend', 'spring', 'https://images.unsplash.com/photo-1615378809998-afc904c40b04', 'Pantone Color Report', '2024-02-01', '2024-06-01'),
  ('Sustainable Denim', 'Eco-friendly denim with minimal water usage and recycled materials', 'seasonal', 'all', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 'Sustainability Report', '2024-01-01', '2024-12-31');

-- Insert product recommendations
INSERT INTO product_recommendations (name, type, color, price, image_url, product_url, reason, category)
VALUES
  ('Linen Blazer', 'jacket', 'beige', '129.99', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea', 'https://example.com/shop', 'Perfect for the Coastal Grandma trend', 'style_match'),
  ('Lavender Sweater', 'sweater', 'purple', '59.99', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990', 'https://example.com/shop', 'Matches current color trends', 'trend'),
  ('Recycled Denim Jeans', 'pants', 'blue', '89.99', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246', 'https://example.com/shop', 'Sustainable wardrobe essential', 'wardrobe_gap');
