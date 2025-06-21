
import type { Product } from '@/lib/types';

// Legacy product data type (temporary for migration)
type LegacyProductData = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
  dataAiHint?: string;
};

export const legacyProductsData: LegacyProductData[] = [
  {
    "id": "1",
    "name": "Aloe Vera",
    "price": 4.99,
    "category": "Herbs",
    "imageUrl": "https://unsplash.com/photos/green-leafed-plant-XtE3QnLgyF8",
    "description": "Fresh aloe vera leaves, perfect for natural skincare and health remedies.",
    "dataAiHint": "aloe vera plant herb"
  },
  {
    "id": "2",
    "name": "Amla (Indian Gooseberry)",
    "price": 3.99,
    "category": "Fruits",
    "imageUrl": "https://unsplash.com/photos/a-pile-of-green-grapes-sitting-next-to-each-other-JwBhrvKg2k8",
    "description": "Rich in Vitamin C, these tart fruits are excellent for immunity and health.",
    "dataAiHint": "amla indian gooseberry fruit"
  },
  {
    "id": "3",
    "name": "Green Apples",
    "price": 2.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=300&h=300&fit=crop&crop=center",
    "description": "Crisp and tart green apples, perfect for eating fresh or baking.",
    "dataAiHint": "green apple fruit"
  },
  {
    "id": "4",
    "name": "Golden Apples",
    "price": 3.25,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet and juicy golden apples with a crisp texture and delicate flavor.",
    "dataAiHint": "golden apple fruit"
  },
  {
    "id": "5",
    "name": "Pink Lady Apples",
    "price": 3.75,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop&crop=center",
    "description": "Premium pink-red apples with a perfect balance of sweet and tart flavors.",
    "dataAiHint": "pink lady apple fruit"
  },
  {
    "id": "6",
    "name": "Red Delicious Apples",
    "price": 2.89,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&h=300&fit=crop&crop=center",
    "description": "Classic red apples with sweet flavor and crisp texture.",
    "dataAiHint": "red apple fruit"
  },
  {
    "id": "7",
    "name": "Red-Green Apples",
    "price": 3.10,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1576179635662-9d1983e97e1e?w=300&h=300&fit=crop&crop=center",
    "description": "Mixed variety apples with beautiful red-green coloring and balanced flavor.",
    "dataAiHint": "red green apple fruit"
  },
  {
    "id": "8",
    "name": "Apricots",
    "price": 4.50,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet, velvety apricots with a delicate floral aroma and juicy flesh.",
    "dataAiHint": "apricot fruit"
  },
  {
    "id": "9",
    "name": "Arvi (Taro Root)",
    "price": 2.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&h=300&fit=crop&crop=center",
    "description": "Pakistani taro root, perfect for traditional curries and stews.",
    "dataAiHint": "taro root arvi vegetable"
  },
  {
    "id": "10",
    "name": "Aubergine (Eggplant)",
    "price": 2.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1659261200833-ec8761558af7?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh purple aubergines, versatile for grilling, roasting, or curry dishes.",
    "dataAiHint": "eggplant aubergine vegetable"
  },
  {
    "id": "11",
    "name": "Long Aubergine",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=300&fit=crop&crop=center",
    "description": "Elongated variety of aubergine, ideal for slicing and Mediterranean dishes.",
    "dataAiHint": "long eggplant aubergine vegetable"
  },
  {
    "id": "12",
    "name": "English Avocado",
    "price": 1.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop&crop=center",
    "description": "Creamy English avocados, perfect for guacamole, salads, and toast.",
    "dataAiHint": "avocado fruit"
  },
  {
    "id": "13",
    "name": "Ugandan Avocado",
    "price": 2.25,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=300&fit=crop&crop=center",
    "description": "Large, buttery Ugandan avocados with rich, creamy texture.",
    "dataAiHint": "ugandan avocado fruit"
  },
  {
    "id": "14",
    "name": "Bananas",
    "price": 1.89,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh yellow bananas, naturally sweet and packed with potassium.",
    "dataAiHint": "banana fruit"
  },
  {
    "id": "15",
    "name": "Long Beans",
    "price": 3.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1553978297-833d09932d65?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh long green beans, tender and crisp, perfect for stir-fries.",
    "dataAiHint": "long beans green beans vegetable"
  },
  {
    "id": "16",
    "name": "Broad Beans",
    "price": 4.15,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1557844352-761f2565b576?w=300&h=300&fit=crop&crop=center",
    "description": "Large, meaty broad beans with a distinctive earthy flavor.",
    "dataAiHint": "broad beans fava beans vegetable"
  },
  {
    "id": "17",
    "name": "Butternut Squash",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet, nutty butternut squash, excellent for soups and roasting.",
    "dataAiHint": "butternut squash vegetable"
  },
  {
    "id": "18",
    "name": "White Cabbage",
    "price": 1.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh white cabbage, perfect for coleslaw, stir-fries, and soups.",
    "dataAiHint": "white cabbage vegetable"
  },
  {
    "id": "19",
    "name": "Red Cabbage",
    "price": 1.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1553978297-833d09932d65?w=300&h=300&fit=crop&crop=center",
    "description": "Vibrant red cabbage, rich in antioxidants and great for salads.",
    "dataAiHint": "red cabbage vegetable"
  },
  {
    "id": "20",
    "name": "Turkish Cabbage",
    "price": 2.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop&crop=center",
    "description": "Premium Turkish cabbage with tender leaves and mild flavor.",
    "dataAiHint": "turkish cabbage vegetable"
  },
  {
    "id": "21",
    "name": "English Carrots",
    "price": 1.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet, crunchy English carrots, perfect for snacking or cooking.",
    "dataAiHint": "carrot vegetable"
  },
  {
    "id": "22",
    "name": "Pakistani Carrots",
    "price": 1.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop&crop=center",
    "description": "Traditional Pakistani carrots with intense color and sweet flavor.",
    "dataAiHint": "pakistani carrot vegetable"
  },
  {
    "id": "23",
    "name": "Cassava",
    "price": 2.89,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh cassava root, a staple carbohydrate with mild, starchy flavor.",
    "dataAiHint": "cassava root vegetable"
  },
  {
    "id": "24",
    "name": "Green Chilli",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh green chillies, perfect for adding heat to your dishes.",
    "dataAiHint": "green chilli pepper vegetable"
  },
  {
    "id": "25",
    "name": "Bird's Eye Chilli",
    "price": 4.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1525908361204-2c2ce3e11490?w=300&h=300&fit=crop&crop=center",
    "description": "Very hot bird's eye chillies, small but extremely spicy.",
    "dataAiHint": "birds eye chilli pepper hot vegetable"
  },
  {
    "id": "26",
    "name": "Bullet Chilli",
    "price": 3.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1635839669889-c2fde5a6fb42?w=300&h=300&fit=crop&crop=center",
    "description": "Medium-hot bullet chillies with intense flavor and moderate heat.",
    "dataAiHint": "bullet chilli pepper vegetable"
  },
  {
    "id": "27",
    "name": "Thai Green Chilli (Pre-pack)",
    "price": 2.50,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1604572070463-edb0cfae8b90?w=300&h=300&fit=crop&crop=center",
    "description": "Authentic Thai green chillies, pre-packed for convenience.",
    "dataAiHint": "thai green chilli pepper vegetable"
  },
  {
    "id": "28",
    "name": "Thai Large Green Chilli (Pre-pack)",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1606316311134-a7b46b6e2e15?w=300&h=300&fit=crop&crop=center",
    "description": "Large Thai green chillies, perfect for Thai cooking and curries.",
    "dataAiHint": "thai large green chilli pepper vegetable"
  },
  {
    "id": "29",
    "name": "Thai Green Chilli (3kg)",
    "price": 12.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1546547851-7c7854d9d0d1?w=300&h=300&fit=crop&crop=center",
    "description": "Bulk pack of Thai green chillies, ideal for restaurants and bulk cooking.",
    "dataAiHint": "thai green chilli bulk vegetable"
  },
  {
    "id": "30",
    "name": "Thai Large Green Chilli (3kg)",
    "price": 14.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1578839431095-d6d5c4b3d75d?w=300&h=300&fit=crop&crop=center",
    "description": "Bulk pack of large Thai green chillies for commercial use.",
    "dataAiHint": "thai large green chilli bulk vegetable"
  },
  {
    "id": "31",
    "name": "Red Long Chilli",
    "price": 3.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Long red chillies with moderate heat and sweet flavor.",
    "dataAiHint": "red long chilli pepper vegetable"
  },
  {
    "id": "32",
    "name": "Chickoo (Sapota)",
    "price": 4.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1609501676725-7186f0a57a05?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet, brown chickoo fruits with grainy texture and caramel-like flavor.",
    "dataAiHint": "chickoo sapota fruit"
  },
  {
    "id": "33",
    "name": "Chow Chow",
    "price": 2.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1562461730-3cc45e6b5962?w=300&h=300&fit=crop&crop=center",
    "description": "Mild-flavored chow chow, perfect for stir-fries and curries.",
    "dataAiHint": "chow chow vegetable"
  },
  {
    "id": "34",
    "name": "Clementines",
    "price": 3.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet, seedless clementines that are easy to peel and eat.",
    "dataAiHint": "clementine citrus fruit"
  },
  {
    "id": "35",
    "name": "English Cucumber",
    "price": 1.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop&crop=center",
    "description": "Long English cucumbers with crisp texture and mild flavor.",
    "dataAiHint": "english cucumber vegetable"
  },
  {
    "id": "36",
    "name": "Baby Cucumber (10kg)",
    "price": 15.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=300&h=300&fit=crop&crop=center",
    "description": "Small, tender baby cucumbers in bulk packaging.",
    "dataAiHint": "baby cucumber bulk vegetable"
  },
  {
    "id": "37",
    "name": "Baby Cucumber (5kg)",
    "price": 8.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1571814857025-4b9c4b79b43a?w=300&h=300&fit=crop&crop=center",
    "description": "Medium bulk pack of baby cucumbers for smaller quantities.",
    "dataAiHint": "baby cucumber vegetable"
  },
  {
    "id": "38",
    "name": "Curry Leaves",
    "price": 1.99,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1609205801107-e0c90e36b8d4?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh curry leaves, essential for authentic South Asian cooking.",
    "dataAiHint": "curry leaves herb"
  },
  {
    "id": "39",
    "name": "Coconut",
    "price": 2.49,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1509486364502-de7a480c5d2c?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh coconuts with sweet water and tender flesh.",
    "dataAiHint": "coconut fruit"
  },
  {
    "id": "40",
    "name": "Cocoyam",
    "price": 3.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1635853882375-3e5b8b5c5b9a?w=300&h=300&fit=crop&crop=center",
    "description": "Traditional cocoyam root, perfect for African dishes and stews.",
    "dataAiHint": "cocoyam root vegetable"
  },
  {
    "id": "41",
    "name": "Coriander",
    "price": 1.49,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1585435465161-1e15e6d16e31?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh coriander leaves, perfect for garnishing and flavoring dishes.",
    "dataAiHint": "coriander cilantro herb"
  },
  {
    "id": "42",
    "name": "Dill",
    "price": 1.99,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1601398021405-b8e8b8c36e71?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh dill with distinctive aromatic flavor, great for fish dishes.",
    "dataAiHint": "dill herb"
  },
  {
    "id": "43",
    "name": "Drumstick",
    "price": 3.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1633630618459-7b4a0c8ccd02?w=300&h=300&fit=crop&crop=center",
    "description": "Long drumstick pods, commonly used in South Asian curries.",
    "dataAiHint": "drumstick moringa vegetable"
  },
  {
    "id": "44",
    "name": "Fresh Yellow Dates",
    "price": 5.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh yellow dates with sweet, chewy texture and rich flavor.",
    "dataAiHint": "yellow dates fruit"
  },
  {
    "id": "45",
    "name": "Majol Dates",
    "price": 7.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=300&h=300&fit=crop&crop=center",
    "description": "Premium Majol dates, large and incredibly sweet.",
    "dataAiHint": "majol dates fruit"
  },
  {
    "id": "46",
    "name": "Eddo",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1610476960477-2220bb49d2f5?w=300&h=300&fit=crop&crop=center",
    "description": "Small taro-like eddo roots, perfect for Caribbean cooking.",
    "dataAiHint": "eddo taro root vegetable"
  },
  {
    "id": "47",
    "name": "Garlic (10-pack)",
    "price": 4.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1589927986089-35812388d1d4?w=300&h=300&fit=crop&crop=center",
    "description": "Pre-packed garlic bulbs, convenient 10-piece pack.",
    "dataAiHint": "garlic bulb vegetable"
  },
  {
    "id": "48",
    "name": "Garlic (20-pack)",
    "price": 8.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1603119595297-9eb0d2de4e23?w=300&h=300&fit=crop&crop=center",
    "description": "Bulk garlic pack with 20 fresh bulbs for heavy cooking needs.",
    "dataAiHint": "garlic bulk vegetable"
  },
  {
    "id": "49",
    "name": "Garlic (40-pack)",
    "price": 16.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1567521464027-f9e8dfe18fdc?w=300&h=300&fit=crop&crop=center",
    "description": "Large commercial pack of 40 garlic bulbs for restaurants.",
    "dataAiHint": "garlic commercial bulk vegetable"
  },
  {
    "id": "50",
    "name": "Loose Garlic",
    "price": 3.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1616684554439-4d4be7ab47a6?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh garlic sold by weight, select your own quantity.",
    "dataAiHint": "loose garlic vegetable"
  },
  {
    "id": "51",
    "name": "Peeled Garlic",
    "price": 6.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1595330663615-1b5a9ee9e90a?w=300&h=300&fit=crop&crop=center",
    "description": "Pre-peeled garlic cloves, ready to use and time-saving.",
    "dataAiHint": "peeled garlic cloves vegetable"
  },
  {
    "id": "52",
    "name": "Garden Eggs",
    "price": 3.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1611080460535-02071be0f389?w=300&h=300&fit=crop&crop=center",
    "description": "Small white African eggplants, perfect for traditional dishes.",
    "dataAiHint": "garden eggs african eggplant vegetable"
  },
  {
    "id": "53",
    "name": "Ginger",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1432664268049-1c1b3e3b0b4f?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh ginger root, essential for cooking and health remedies.",
    "dataAiHint": "ginger root vegetable"
  },
  {
    "id": "54",
    "name": "Guar (Cluster Beans)",
    "price": 3.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1557844352-761f2565b576?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh guar beans, tender and nutritious green vegetables.",
    "dataAiHint": "guar cluster beans vegetable"
  },
  {
    "id": "55",
    "name": "Guava",
    "price": 3.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1536511132770-e5058c5b1089?w=300&h=300&fit=crop&crop=center",
    "description": "Tropical guavas with sweet, aromatic flesh and high vitamin C.",
    "dataAiHint": "guava fruit"
  },
  {
    "id": "56",
    "name": "Haldi (Turmeric)",
    "price": 4.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh yellow turmeric root, perfect for cooking and health benefits.",
    "dataAiHint": "turmeric haldi root vegetable"
  },
  {
    "id": "57",
    "name": "Ugandan Hot Pepper",
    "price": 4.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1525908361204-2c2ce3e11490?w=300&h=300&fit=crop&crop=center",
    "description": "Very hot Ugandan peppers with intense heat and flavor.",
    "dataAiHint": "ugandan hot pepper vegetable"
  },
  {
    "id": "58",
    "name": "Red Hot Pepper",
    "price": 3.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Fiery red hot peppers for those who love extreme heat.",
    "dataAiHint": "red hot pepper vegetable"
  },
  {
    "id": "59",
    "name": "Long Bottle Gourd",
    "price": 2.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Long bottle gourd, mild-flavored and perfect for curries.",
    "dataAiHint": "long bottle gourd vegetable"
  },
  {
    "id": "60",
    "name": "Round Bottle Gourd",
    "price": 2.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop&crop=center",
    "description": "Round variety of bottle gourd with tender flesh.",
    "dataAiHint": "round bottle gourd vegetable"
  },
  {
    "id": "61",
    "name": "Karela (Bitter Gourd)",
    "price": 3.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh bitter gourd with distinctive bitter taste, excellent for health.",
    "dataAiHint": "karela bitter gourd vegetable"
  },
  {
    "id": "62",
    "name": "Lahana (Chinese Cabbage)",
    "price": 2.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh Chinese cabbage with tender leaves and mild flavor.",
    "dataAiHint": "lahana chinese cabbage vegetable"
  },
  {
    "id": "63",
    "name": "Lemons",
    "price": 2.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1587486936602-997e9e0e9a1c?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh lemons with bright citrus flavor, perfect for cooking and drinks.",
    "dataAiHint": "lemon citrus fruit"
  },
  {
    "id": "64",
    "name": "Lettuce",
    "price": 1.89,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh crisp lettuce leaves, perfect for salads and sandwiches.",
    "dataAiHint": "lettuce salad vegetable"
  },
  {
    "id": "65",
    "name": "Limes",
    "price": 2.49,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&h=300&fit=crop&crop=center",
    "description": "Juicy limes with tart flavor, essential for cocktails and cooking.",
    "dataAiHint": "lime citrus fruit"
  },
  {
    "id": "66",
    "name": "Dominican Mango",
    "price": 2.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet Dominican mangoes with rich, tropical flavor.",
    "dataAiHint": "dominican mango fruit"
  },
  {
    "id": "67",
    "name": "Alphonso Mango",
    "price": 4.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1605027990121-3b2c6ed4ac5a?w=300&h=300&fit=crop&crop=center",
    "description": "Premium Alphonso mangoes, the king of mangoes with exceptional taste.",
    "dataAiHint": "alphonso mango fruit"
  },
  {
    "id": "68",
    "name": "Badami Mango",
    "price": 3.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1583481176210-f5e22aeab5a5?w=300&h=300&fit=crop&crop=center",
    "description": "Fragrant Badami mangoes with sweet, creamy flesh.",
    "dataAiHint": "badami mango fruit"
  },
  {
    "id": "69",
    "name": "Kesar Mango",
    "price": 4.49,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1591206369811-4eeb2f03bc95?w=300&h=300&fit=crop&crop=center",
    "description": "Golden Kesar mangoes with distinctive saffron-like aroma.",
    "dataAiHint": "kesar mango fruit"
  },
  {
    "id": "70",
    "name": "Thai Mango",
    "price": 3.75,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet Thai mangoes with smooth, fiber-free flesh.",
    "dataAiHint": "thai mango fruit"
  },
  {
    "id": "71",
    "name": "Chaunsa Mango",
    "price": 4.25,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1589927986089-35812388d1d4?w=300&h=300&fit=crop&crop=center",
    "description": "Premium Pakistani Chaunsa mangoes with rich, sweet flavor.",
    "dataAiHint": "chaunsa mango fruit"
  },
  {
    "id": "72",
    "name": "Sindhri Mango",
    "price": 3.89,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1605027990121-3b2c6ed4ac5a?w=300&h=300&fit=crop&crop=center",
    "description": "Large Sindhri mangoes from Pakistan with honey-like sweetness.",
    "dataAiHint": "sindhri mango fruit"
  },
  {
    "id": "73",
    "name": "Dodo Mango",
    "price": 2.75,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1583481176210-f5e22aeab5a5?w=300&h=300&fit=crop&crop=center",
    "description": "Traditional Dodo mangoes with unique flavor and texture.",
    "dataAiHint": "dodo mango fruit"
  },
  {
    "id": "74",
    "name": "Raw Mango",
    "price": 2.25,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1591206369811-4eeb2f03bc95?w=300&h=300&fit=crop&crop=center",
    "description": "Unripe green mangoes, perfect for pickles and chutneys.",
    "dataAiHint": "raw green mango fruit"
  },
  {
    "id": "75",
    "name": "Matoki (Green Bananas)",
    "price": 2.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center",
    "description": "Green cooking bananas, staple food in African cuisine.",
    "dataAiHint": "matoki green bananas vegetable"
  },
  {
    "id": "76",
    "name": "Methi (Fenugreek Leaves)",
    "price": 1.99,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1585435465161-1e15e6d16e31?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh methi leaves with distinctive bitter taste and health benefits.",
    "dataAiHint": "methi fenugreek leaves herb"
  },
  {
    "id": "77",
    "name": "Pakistani Melon",
    "price": 3.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet Pakistani melons with juicy, refreshing flesh.",
    "dataAiHint": "pakistani melon fruit"
  },
  {
    "id": "78",
    "name": "Galia Melon",
    "price": 2.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1546548970-71785318a17b?w=300&h=300&fit=crop&crop=center",
    "description": "Fragrant Galia melons with sweet, aromatic flesh.",
    "dataAiHint": "galia melon fruit"
  },
  {
    "id": "79",
    "name": "Yellow Melon",
    "price": 2.75,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1567522352832-de4b7fc13e27?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet yellow melons with soft, juicy texture.",
    "dataAiHint": "yellow melon fruit"
  },
  {
    "id": "80",
    "name": "Mint",
    "price": 1.49,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh mint leaves, perfect for teas, cocktails, and cooking.",
    "dataAiHint": "mint leaves herb"
  },
  {
    "id": "81",
    "name": "Mooli (White Radish)",
    "price": 1.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh white radish with crisp texture and peppery flavor.",
    "dataAiHint": "mooli white radish vegetable"
  },
  {
    "id": "82",
    "name": "Mooli Leaves",
    "price": 1.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh radish leaves, nutritious and perfect for stir-fries.",
    "dataAiHint": "mooli radish leaves vegetable"
  },
  {
    "id": "83",
    "name": "Okra (Lady Fingers)",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh okra pods, tender and perfect for curries and stir-fries.",
    "dataAiHint": "okra lady fingers vegetable"
  },
  {
    "id": "84",
    "name": "Onions (4kg)",
    "price": 3.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1594822423616-8f70fd5ca531?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh onions in convenient 4kg pack for regular cooking needs.",
    "dataAiHint": "onions bulk vegetable"
  },
  {
    "id": "85",
    "name": "Onions (8kg)",
    "price": 7.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=300&fit=crop&crop=center",
    "description": "Medium bulk pack of fresh onions for heavy cooking requirements.",
    "dataAiHint": "onions medium bulk vegetable"
  },
  {
    "id": "86",
    "name": "Onions (18kg)",
    "price": 16.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1595255297844-a3c6ecffba8e?w=300&h=300&fit=crop&crop=center",
    "description": "Large bulk pack of onions ideal for restaurants and catering.",
    "dataAiHint": "onions large bulk vegetable"
  },
  {
    "id": "87",
    "name": "Onions (24kg)",
    "price": 21.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1612190961155-6b9e3a9b43d3?w=300&h=300&fit=crop&crop=center",
    "description": "Commercial size onion pack for wholesale and restaurant use.",
    "dataAiHint": "onions commercial bulk vegetable"
  },
  {
    "id": "88",
    "name": "Spanish Onions",
    "price": 2.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Large, sweet Spanish onions perfect for grilling and roasting.",
    "dataAiHint": "spanish onions vegetable"
  },
  {
    "id": "89",
    "name": "Red Onions",
    "price": 2.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=300&fit=crop&crop=center",
    "description": "Sharp red onions with distinctive color and strong flavor.",
    "dataAiHint": "red onions vegetable"
  },
  {
    "id": "90",
    "name": "White Onions (Pre-pack)",
    "price": 1.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1612190961155-6b9e3a9b43d3?w=300&h=300&fit=crop&crop=center",
    "description": "Pre-packed white onions for convenient household use.",
    "dataAiHint": "white onions prepack vegetable"
  },
  {
    "id": "91",
    "name": "Red Onions (Pre-pack)",
    "price": 2.09,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1594822423616-8f70fd5ca531?w=300&h=300&fit=crop&crop=center",
    "description": "Convenient pre-packed red onions for regular cooking.",
    "dataAiHint": "red onions prepack vegetable"
  },
  {
    "id": "92",
    "name": "Shallot Onions",
    "price": 3.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=300&fit=crop&crop=center",
    "description": "Mild, sweet shallot onions perfect for fine cooking and sauces.",
    "dataAiHint": "shallot onions vegetable"
  },
  {
    "id": "93",
    "name": "Bombay Onions",
    "price": 2.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1595255297844-a3c6ecffba8e?w=300&h=300&fit=crop&crop=center",
    "description": "Traditional Bombay onions with strong flavor and aroma.",
    "dataAiHint": "bombay onions vegetable"
  },
  {
    "id": "94",
    "name": "Spring Onions",
    "price": 1.89,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh spring onions with green tops, mild and versatile.",
    "dataAiHint": "spring onions scallions vegetable"
  },
  {
    "id": "95",
    "name": "Patra Leaves",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&crop=center",
    "description": "Large patra leaves perfect for traditional Indian steamed dishes.",
    "dataAiHint": "patra leaves vegetable"
  },
  {
    "id": "96",
    "name": "Yellow Papaya",
    "price": 2.49,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop&crop=center",
    "description": "Ripe yellow papaya with sweet, tropical flavor and soft texture.",
    "dataAiHint": "yellow papaya fruit"
  },
  {
    "id": "97",
    "name": "Raw Papaya",
    "price": 1.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1546548970-71785318a17b?w=300&h=300&fit=crop&crop=center",
    "description": "Green raw papaya, perfect for salads and traditional dishes.",
    "dataAiHint": "raw green papaya vegetable"
  },
  {
    "id": "98",
    "name": "Paan Leaves",
    "price": 3.99,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1609205801107-e0c90e36b8d4?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh betel leaves used for traditional paan preparation.",
    "dataAiHint": "paan betel leaves herb"
  },
  {
    "id": "99",
    "name": "Parval (Pointed Gourd)",
    "price": 3.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh parval with tender flesh, excellent for curries and stir-fries.",
    "dataAiHint": "parval pointed gourd vegetable"
  },
  {
    "id": "100",
    "name": "Parsley",
    "price": 1.69,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1585435465161-1e15e6d16e31?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh curly parsley, perfect for garnishing and flavoring dishes.",
    "dataAiHint": "parsley herb"
  },
  {
    "id": "101",
    "name": "Flat Parsley",
    "price": 1.79,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1601398021405-b8e8b8c36e71?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh flat-leaf parsley with stronger flavor than curly variety.",
    "dataAiHint": "flat parsley herb"
  },
  {
    "id": "102",
    "name": "Green Peppers",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh green bell peppers, crisp and mild-flavored.",
    "dataAiHint": "green bell peppers vegetable"
  },
  {
    "id": "103",
    "name": "Red Peppers",
    "price": 3.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1525908361204-2c2ce3e11490?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet red bell peppers with vibrant color and rich flavor.",
    "dataAiHint": "red bell peppers vegetable"
  },
  {
    "id": "104",
    "name": "Turkish Pears",
    "price": 3.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet Turkish pears with juicy flesh and delicate flavor.",
    "dataAiHint": "turkish pears fruit"
  },
  {
    "id": "105",
    "name": "Pakistani Peas",
    "price": 3.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1557844352-761f2565b576?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh Pakistani peas, sweet and tender in pods.",
    "dataAiHint": "pakistani peas vegetable"
  },
  {
    "id": "106",
    "name": "Raw Peanuts",
    "price": 2.99,
    "category": "Nuts",
    "imageUrl": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh raw peanuts, perfect for roasting or cooking.",
    "dataAiHint": "raw peanuts nuts"
  },
  {
    "id": "107",
    "name": "Green Plantains",
    "price": 2.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center",
    "description": "Unripe green plantains, perfect for frying and cooking.",
    "dataAiHint": "green plantains vegetable"
  },
  {
    "id": "108",
    "name": "Yellow Plantains",
    "price": 2.49,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1603119595297-9eb0d2de4e23?w=300&h=300&fit=crop&crop=center",
    "description": "Ripe yellow plantains, sweet and perfect for desserts.",
    "dataAiHint": "yellow plantains fruit"
  },
  {
    "id": "109",
    "name": "Pomelo",
    "price": 3.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&h=300&fit=crop&crop=center",
    "description": "Large pomelo citrus fruit with sweet, mild flavor.",
    "dataAiHint": "pomelo citrus fruit"
  },
  {
    "id": "110",
    "name": "Large Pomegranates",
    "price": 4.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop&crop=center",
    "description": "Large pomegranates with ruby red seeds and antioxidant benefits.",
    "dataAiHint": "pomegranate fruit"
  },
  {
    "id": "111",
    "name": "White Potatoes (Pre-pack)",
    "price": 2.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh white potatoes in convenient pre-pack sizing.",
    "dataAiHint": "white potatoes vegetable"
  },
  {
    "id": "112",
    "name": "Red Potatoes (Pre-pack)",
    "price": 2.69,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1594822423616-8f70fd5ca531?w=300&h=300&fit=crop&crop=center",
    "description": "Red-skinned potatoes with waxy texture, perfect for boiling.",
    "dataAiHint": "red potatoes vegetable"
  },
  {
    "id": "113",
    "name": "White Potatoes (8kg)",
    "price": 8.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1595255297844-a3c6ecffba8e?w=300&h=300&fit=crop&crop=center",
    "description": "Bulk pack of white potatoes for heavy cooking requirements.",
    "dataAiHint": "white potatoes bulk vegetable"
  },
  {
    "id": "114",
    "name": "Red Potatoes (8kg)",
    "price": 9.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1612190961155-6b9e3a9b43d3?w=300&h=300&fit=crop&crop=center",
    "description": "Bulk pack of red potatoes ideal for restaurants and catering.",
    "dataAiHint": "red potatoes bulk vegetable"
  },
  {
    "id": "115",
    "name": "Baby Potatoes",
    "price": 3.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Small, tender baby potatoes perfect for roasting whole.",
    "dataAiHint": "baby potatoes vegetable"
  },
  {
    "id": "116",
    "name": "Red Sweet Potatoes",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1594822423616-8f70fd5ca531?w=300&h=300&fit=crop&crop=center",
    "description": "Sweet red-fleshed sweet potatoes with natural sweetness.",
    "dataAiHint": "red sweet potatoes vegetable"
  },
  {
    "id": "117",
    "name": "White Sweet Potatoes",
    "price": 2.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1612190961155-6b9e3a9b43d3?w=300&h=300&fit=crop&crop=center",
    "description": "White-fleshed sweet potatoes with mild, sweet flavor.",
    "dataAiHint": "white sweet potatoes vegetable"
  },
  {
    "id": "118",
    "name": "Quince Pears",
    "price": 4.25,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop&crop=center",
    "description": "Aromatic quince pears, perfect for cooking and preserves.",
    "dataAiHint": "quince pears fruit"
  },
  {
    "id": "119",
    "name": "Ravia (Ridge Gourd)",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh ridge gourd with tender flesh and mild flavor.",
    "dataAiHint": "ravia ridge gourd vegetable"
  },
  {
    "id": "120",
    "name": "Black Beauty Ravia",
    "price": 3.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1659261200833-ec8761558af7?w=300&h=300&fit=crop&crop=center",
    "description": "Dark variety of ridge gourd with rich flavor.",
    "dataAiHint": "black beauty ravia ridge gourd vegetable"
  },
  {
    "id": "121",
    "name": "Green Ravia",
    "price": 2.89,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop&crop=center",
    "description": "Standard green ridge gourd, versatile for various dishes.",
    "dataAiHint": "green ravia ridge gourd vegetable"
  },
  {
    "id": "122",
    "name": "Pink Ravia",
    "price": 3.15,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=300&fit=crop&crop=center",
    "description": "Pink variety of ridge gourd with delicate flavor and texture.",
    "dataAiHint": "pink ravia ridge gourd vegetable"
  },
  {
    "id": "123",
    "name": "Stripey Ravia",
    "price": 3.05,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1611080460535-02071be0f389?w=300&h=300&fit=crop&crop=center",
    "description": "Striped variety of ridge gourd with attractive appearance.",
    "dataAiHint": "stripey ravia ridge gourd vegetable"
  },
  {
    "id": "124",
    "name": "Romero (Rosemary)",
    "price": 2.25,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh rosemary herbs with strong aromatic flavor for cooking.",
    "dataAiHint": "romero rosemary herb"
  },
  {
    "id": "125",
    "name": "Green Romero (Pre-pack)",
    "price": 1.99,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1585435465161-1e15e6d16e31?w=300&h=300&fit=crop&crop=center",
    "description": "Pre-packed fresh green rosemary for convenient use.",
    "dataAiHint": "green romero rosemary herb prepack"
  },
  {
    "id": "126",
    "name": "Red Romero (Pre-pack)",
    "price": 2.15,
    "category": "Herbs",
    "imageUrl": "https://images.unsplash.com/photo-1601398021405-b8e8b8c36e71?w=300&h=300&fit=crop&crop=center",
    "description": "Red variety of rosemary with intense flavor, pre-packed.",
    "dataAiHint": "red romero rosemary herb prepack"
  },
  {
    "id": "127",
    "name": "Saag (Mustard Greens)",
    "price": 2.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh mustard greens, perfect for traditional saag dishes.",
    "dataAiHint": "saag mustard greens vegetable"
  },
  {
    "id": "128",
    "name": "Saag Rakat (Red Mustard)",
    "price": 2.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1553978297-833d09932d65?w=300&h=300&fit=crop&crop=center",
    "description": "Red variety of mustard greens with stronger flavor.",
    "dataAiHint": "saag rakat red mustard greens vegetable"
  },
  {
    "id": "129",
    "name": "Spinach",
    "price": 1.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh spinach leaves, rich in iron and perfect for salads.",
    "dataAiHint": "spinach leafy greens vegetable"
  },
  {
    "id": "130",
    "name": "Sugar Cane",
    "price": 3.99,
    "category": "Fruits",
    "imageUrl": "https://images.unsplash.com/photo-1609501676725-7186f0a57a05?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh sugar cane sticks, naturally sweet and refreshing.",
    "dataAiHint": "sugar cane fruit"
  },
  {
    "id": "131",
    "name": "Tandoora",
    "price": 2.89,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1583692331626-d92d6d1d4ac7?w=300&h=300&fit=crop&crop=center",
    "description": "Traditional tandoora vegetable with unique flavor and texture.",
    "dataAiHint": "tandoora vegetable"
  },
  {
    "id": "132",
    "name": "Tinda (Round Gourd)",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop&crop=center",
    "description": "Small round gourds, popular in South Asian cuisine.",
    "dataAiHint": "tinda round gourd vegetable"
  },
  {
    "id": "133",
    "name": "Turiya (Snake Gourd)",
    "price": 3.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1611080460535-02071be0f389?w=300&h=300&fit=crop&crop=center",
    "description": "Long snake gourd with mild flavor, perfect for curries.",
    "dataAiHint": "turiya snake gourd vegetable"
  },
  {
    "id": "134",
    "name": "Tomatoes",
    "price": 2.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1546470427-227da4b9c82e?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh red tomatoes, essential for cooking and salads.",
    "dataAiHint": "tomatoes vegetable"
  },
  {
    "id": "135",
    "name": "Beef Tomatoes",
    "price": 3.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1553978297-833d09932d65?w=300&h=300&fit=crop&crop=center",
    "description": "Large beef tomatoes with meaty texture and rich flavor.",
    "dataAiHint": "beef tomatoes large vegetable"
  },
  {
    "id": "136",
    "name": "Wine Tomatoes",
    "price": 4.25,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop&crop=center",
    "description": "Premium wine tomatoes with intense flavor and deep color.",
    "dataAiHint": "wine tomatoes premium vegetable"
  },
  {
    "id": "137",
    "name": "Turnips",
    "price": 1.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh turnips with crisp texture and peppery flavor.",
    "dataAiHint": "turnips root vegetable"
  },
  {
    "id": "138",
    "name": "Turnip Leaves",
    "price": 1.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&crop=center",
    "description": "Nutritious turnip greens, perfect for sautéing and stir-fries.",
    "dataAiHint": "turnip leaves greens vegetable"
  },
  {
    "id": "139",
    "name": "Valur (Hyacinth Beans)",
    "price": 3.49,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1557844352-761f2565b576?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh valur beans with tender pods and nutty flavor.",
    "dataAiHint": "valur hyacinth beans vegetable"
  },
  {
    "id": "140",
    "name": "White Marrow",
    "price": 2.99,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop&crop=center",
    "description": "Large white marrow squash with mild flavor and tender flesh.",
    "dataAiHint": "white marrow squash vegetable"
  },
  {
    "id": "141",
    "name": "Yam",
    "price": 3.75,
    "category": "Vegetables",
    "imageUrl": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&h=300&fit=crop&crop=center",
    "description": "Fresh yam tubers with starchy texture, perfect for boiling and roasting.",
    "dataAiHint": "yam root tuber vegetable"
  }
];

// Convert legacy products to new schema directly
export const sampleProducts: Product[] = legacyProductsData.map(legacy => ({
  id: legacy.id,
  productCode: legacy.id,
  productName: legacy.name,
  productImages: [legacy.imageUrl],
  description: legacy.description,
  actualPrice: legacy.price,
  discount: 0,
  finalPrice: legacy.price,
  category: legacy.category,
  subCategory: undefined,
  returnable: true,
  storageInstructions: undefined,
  rating: undefined,
  isFeatured: false,
  isTrending: false,
  isNew: false,
  expiryDate: undefined,
  harvestDate: undefined,
  maxPurchaseLimit: undefined,
  deliveryType: 'standard',
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: [],
  shelfLife: undefined,
  dataAiHint: legacy.dataAiHint
}));