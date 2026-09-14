const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('foodies');
    const foods = database.collection('foods');

    // Wipe existing collection to re-seed 70 items cleanly
    await foods.deleteMany({});

    const docs = [
      // ==================== BIRYANI (10 Items) ====================
      {
        name: 'Hyderabadi Dum Biryani',
        price: 290.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Authentic aromatic basmati rice cooked with tender marinated chicken and fragrant spices.'
      },
      {
        name: 'Chicken Dum Biryani',
        price: 260.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Classic dum-cooked chicken biryani served with spicy gravy and cooling cucumber raita.'
      },
      {
        name: 'Mutton Dum Biryani',
        price: 390.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Slow-cooked juicy mutton layered with saffron infused basmati rice and whole spices.'
      },
      {
        name: 'Veg Dum Biryani',
        price: 210.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Garden fresh vegetables layered with long-grain rice, fried onions, and roasted mint.'
      },
      {
        name: 'Egg Dum Biryani',
        price: 190.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Hard-boiled spiced eggs tossed in biryani masala gravy and sealed with dum rice.'
      },
      {
        name: 'Paneer Tikka Biryani',
        price: 240.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Tandoori marinated cottage cheese cubes cooked in spicy biryani rice.'
      },
      {
        name: 'Kolkata Chicken Biryani',
        price: 280.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Subtle aromatic Kolkata style biryani loaded with tender chicken, boiled egg, and soft potato.'
      },
      {
        name: 'Lucknowi Dum Biryani',
        price: 310.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Awadhi royal style biryani infused with kewra water, saffron, and succulent meat.'
      },
      {
        name: 'Prawns Dum Biryani',
        price: 420.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Juicy tiger prawns simmered in coastal masala spices and layered with fragrant dum rice.'
      },
      {
        name: 'Special Boneless Chicken Biryani',
        price: 320.0,
        category: 'Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Tender boneless chicken pieces layered in rich spicy gravy and premium basmati rice.'
      },

      // ==================== BURGER (10 Items) ====================
      {
        name: 'Classic Beef Burger',
        price: 160.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Juicy grilled beef patty topped with melted cheddar cheese, lettuce, tomato, and house sauce.'
      },
      {
        name: 'Crispy Chicken Zinger Burger',
        price: 180.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Extra crunchy fried chicken breast patty layered with spicy mayo and shredded lettuce.'
      },
      {
        name: 'Double Cheese Veggie Burger',
        price: 150.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Loaded vegetable patty with melted double cheddar slice and tangy burger sauce.'
      },
      {
        name: 'BBQ Bacon Cheeseburger',
        price: 220.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Smoky grilled beef patty topped with crispy bacon strips, BBQ sauce, and caramelized onions.'
      },
      {
        name: 'Spicy Jalapeno Burger',
        price: 170.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Fiery burger packed with sliced jalapenos, pepper jack cheese, and spicy chipotle sauce.'
      },
      {
        name: 'Paneer Supreme Burger',
        price: 160.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Crispy fried paneer patty infused with Indian tandoori spices and mint mayo.'
      },
      {
        name: 'Mushroom Swiss Burger',
        price: 190.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Sauteed garlic mushrooms layered over a grilled patty with melted Swiss cheese.'
      },
      {
        name: 'Grilled Chicken Avocado Burger',
        price: 230.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Herb grilled chicken breast served with fresh sliced avocado, tomato, and garlic mayo.'
      },
      {
        name: 'Monster Double Patty Burger',
        price: 280.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Double beef patties, double cheese slices, crispy onion rings, and secret signature sauce.'
      },
      {
        name: 'Fish Fillet Burger',
        price: 200.0,
        category: 'Burger',
        imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Golden fried fish fillet served with creamy tartar sauce and crisp lettuce in a brioche bun.'
      },

      // ==================== CAKE (10 Items) ====================
      {
        name: 'Rich Dark Chocolate Cake',
        price: 360.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Decadent multi-layered dark chocolate sponge with rich chocolate ganache icing.'
      },
      {
        name: 'Red Velvet Cream Cheese Cake',
        price: 420.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Classic cocoa velvet sponge layered with smooth, tangy cream cheese frosting.'
      },
      {
        name: 'Fresh Mango Truffle Cake',
        price: 380.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Light vanilla sponge layered with fresh Alphonso mango pulp and whipped white chocolate.'
      },
      {
        name: 'Black Forest Gateau',
        price: 340.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Traditional German cake with chocolate layers, maraschino cherries, and fresh whipped cream.'
      },
      {
        name: 'Vanilla Buttercream Cake',
        price: 320.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Moist Madagascar vanilla bean sponge frosted with fluffy sweet buttercream.'
      },
      {
        name: 'Blueberry New York Cheesecake',
        price: 450.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Baked graham cracker crust cheesecake topped with vibrant wild blueberry compote.'
      },
      {
        name: 'Salted Caramel Fudge Cake',
        price: 400.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Moist chocolate sponge drizzled with warm salted caramel sauce and chocolate curls.'
      },
      {
        name: 'Strawberry Shortcake',
        price: 350.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Fluffy sponge layers packed with fresh organic strawberries and sweet chantilly cream.'
      },
      {
        name: 'Italian Tiramisu Layer Cake',
        price: 480.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Espresso-soaked ladyfingers and sponge layered with creamy mascarpone cheese and cocoa powder.'
      },
      {
        name: 'Chocolate Lava Molten Cake',
        price: 290.0,
        category: 'Cake',
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Warm chocolate cake with a gooey, molten Belgian chocolate center served hot.'
      },

      // ==================== ICE CREAM (10 Items) ====================
      {
        name: 'Classic Vanilla Bean Ice Cream',
        price: 100.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Smooth and creamy ice cream churned with authentic Madagascar vanilla bean specks.'
      },
      {
        name: 'Belgian Dark Chocolate Ice Cream',
        price: 130.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Rich dark chocolate gelato crafted with imported 70% Belgian cocoa.'
      },
      {
        name: 'Alphonso Mango Delight',
        price: 120.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Luscious tropical ice cream prepared from real Ratnagiri Alphonso mango pulp.'
      },
      {
        name: 'Fresh Strawberry Swirl',
        price: 110.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Creamy milk ice cream blended with natural Mahabaleshwar strawberry fruit ribbon.'
      },
      {
        name: 'Cookies and Cream Crunch',
        price: 140.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Velvety vanilla ice cream loaded with crushed chocolate sandwich cookie chunks.'
      },
      {
        name: 'Roasted Almond Butterscotch',
        price: 150.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Crunchy butterscotch praline and roasted California almonds folded into rich caramel ice cream.'
      },
      {
        name: 'Mint Chocolate Chip Scoop',
        price: 130.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Refreshing mint ice cream sprinkled with dark chocolate flakes.'
      },
      {
        name: 'Pistachio Kulfi Scoop',
        price: 140.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Traditional Indian style condensed milk kulfi enriched with saffron and roasted pistachios.'
      },
      {
        name: 'Salted Caramel Swirl',
        price: 150.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Sweet cream ice cream swirled with sea-salted caramel drizzle.'
      },
      {
        name: 'Berry Explosion Sundae',
        price: 170.0,
        category: 'Ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Triple scoops of raspberry, blueberry, and strawberry ice cream topped with fresh berries.'
      },

      // ==================== PIZZA (10 Items) ====================
      {
        name: 'Margherita Fresh Basil Pizza',
        price: 450.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Classic Italian pizza with San Marzano tomato sauce, fresh mozzarella, and basil leaves.'
      },
      {
        name: 'Pepperoni Feast Pizza',
        price: 550.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Crispy hand-tossed crust topped with double pepperoni slices and melted mozzarella.'
      },
      {
        name: 'BBQ Chicken Cheddar Pizza',
        price: 520.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Smoky BBQ chicken chunks, red onions, cilantro, and sharp cheddar cheese on a crispy crust.'
      },
      {
        name: 'Farmhouse Veggie Lovers Pizza',
        price: 460.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Loaded with crunchy bell peppers, sweet corn, mushrooms, black olives, and onions.'
      },
      {
        name: 'Paneer Tikka Spice Pizza',
        price: 480.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Indian fusion pizza topped with marinated paneer tikka, capsicum, and spicy makhani sauce.'
      },
      {
        name: 'Four Cheese Alfredo Pizza',
        price: 540.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Rich white Alfredo sauce topped with Mozzarella, Parmesan, Gouda, and Ricotta cheeses.'
      },
      {
        name: 'Spicy Mexican Wave Pizza',
        price: 490.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Zesty Mexican pizza with jalapenos, corn, red paprika, refried beans, and spicy salsa.'
      },
      {
        name: 'Hawaiian Pineapple Ham Pizza',
        price: 510.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Sweet and savory combination of juicy pineapple chunks, sliced ham, and mozzarella.'
      },
      {
        name: 'Tandoori Chicken Supreme Pizza',
        price: 560.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Spicy tandoori chicken, green chilies, mint mayo drizzle, and extra cheese.'
      },
      {
        name: 'Mushroom Truffle Gourmet Pizza',
        price: 580.0,
        category: 'Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Wild forest mushrooms, white truffle oil drizzle, fresh thyme, and aged parmesan.'
      },

      // ==================== ROLLS (10 Items) ====================
      {
        name: 'Crispy Vegetable Spring Rolls',
        price: 120.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Golden crunchy spring rolls stuffed with seasoned julienned vegetables and served with sweet chili dip.'
      },
      {
        name: 'Chicken Kathi Roll',
        price: 160.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Flaky paratha wrap stuffed with spiced chicken tikka, sliced onions, and green chutney.'
      },
      {
        name: 'Paneer Tikka Wrap',
        price: 150.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Tandoori marinated paneer cubes wrapped in a warm tortilla with veggies and mint yogurt.'
      },
      {
        name: 'Spicy Egg Kathi Roll',
        price: 140.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Double egg coated paratha rolled with crunchy onions, chilies, and tangy chaat masala.'
      },
      {
        name: 'Double Chicken Double Egg Roll',
        price: 200.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Loaded Kolkata style street roll packed with double egg layer and extra chicken chunks.'
      },
      {
        name: 'Schezwan Noodle Spring Rolls',
        price: 130.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Indo-Chinese style crispy rolls filled with spicy Schezwan noodles and vegetables.'
      },
      {
        name: 'Mutton Seekh Kebab Roll',
        price: 220.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Grilled minced mutton seekh kebab wrapped in buttered laccha paratha with spicy sauce.'
      },
      {
        name: 'Falafel Hummus Wrap',
        price: 160.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Middle Eastern pita wrap filled with chickpea falafel balls, creamy hummus, and tahini.'
      },
      {
        name: 'Cheesy Butter Chicken Roll',
        price: 190.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Shredded butter chicken and melted mozzarella cheese wrapped in a warm flatbread.'
      },
      {
        name: 'Mexican Salsa Burrito Roll',
        price: 170.0,
        category: 'Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Mexican style burrito stuffed with seasoned beans, rice, corn salsa, and sour cream.'
      },

      // ==================== SALAD (10 Items) ====================
      {
        name: 'Classic Caesar Salad',
        price: 180.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Crisp romaine lettuce tossed with garlic herb croutons, parmesan cheese, and Caesar dressing.'
      },
      {
        name: 'Greek Feta & Olive Salad',
        price: 220.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Cucumbers, cherry tomatoes, kalamata olives, red onions, and creamy Greek feta cheese.'
      },
      {
        name: 'Grilled Chicken Avocado Salad',
        price: 260.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Tender grilled chicken breast slices served over avocado, mixed greens, and honey lime vinaigrette.'
      },
      {
        name: 'Fresh Garden Veggie Salad',
        price: 160.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Organic garden greens, carrots, cucumbers, radishes, and tomatoes served with lemon olive oil.'
      },
      {
        name: 'Quinoa & Roasted Veggie Bowl',
        price: 240.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Nutritious superfood salad bowl with quinoa, roasted sweet potatoes, zucchini, and tahini.'
      },
      {
        name: 'Asian Sesame Tofu Salad',
        price: 210.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Pan-seared tofu, edamame beans, purple cabbage, and wonton strips in toasted sesame dressing.'
      },
      {
        name: 'Caprese Tomato Basil Salad',
        price: 230.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Slices of ripe vine tomatoes, fresh buffalo mozzarella, basil leaves, and balsamic reduction.'
      },
      {
        name: 'Italian Pasta Cucumber Salad',
        price: 180.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Chilled fusilli pasta, cucumbers, cherry tomatoes, and bell peppers in Italian zesty herb dressing.'
      },
      {
        name: 'Honey Mustard Chicken Salad',
        price: 250.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Crispy chicken tender strips, sweet corn, boiled egg, and greens with creamy honey mustard.'
      },
      {
        name: 'Citrus Fruit & Walnut Salad',
        price: 200.0,
        category: 'Salad',
        imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        description: 'Baby spinach, orange segments, toasted walnuts, and cranberries tossed in citrus vinaigrette.'
      }
    ];

    const result = await foods.insertMany(docs);
    console.log(`Successfully seeded ${result.insertedCount} food items across 7 categories!`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

run();
