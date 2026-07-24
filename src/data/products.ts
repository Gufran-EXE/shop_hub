export interface ProductReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  category: string;
  isDeal: boolean;
  dealTimer?: number; // duration in seconds for countdown
  inStock: boolean;
  features: string[];
  colors?: string[];          // hex color values
  sizes?: string[];           // e.g. ['S','M','L','XL'] or ['7','8','9']
  specs?: ProductSpec[];
  reviews?: ProductReview[];
}

export const products: Product[] = [
  {
    id: "prod-1",
    name: "AeroSound Pro Hybrid ANC Headphones",
    description: "Experience pure audio bliss with industry-leading hybrid active noise cancelling, high-fidelity sound, and 45-hour battery life.",
    price: 199.99,
    originalPrice: 299.99,
    discount: 33,
    rating: 4.8,
    reviewsCount: 1240,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Electronics",
    isDeal: true,
    dealTimer: 14400,
    inStock: true,
    features: ["Industry-Leading ANC", "45-Hour Battery Life", "Hi-Res Audio Certified", "Multipoint Connection"],
    colors: ["#1e293b", "#f8fafc", "#4f46e5", "#dc2626"],
    specs: [
      { label: "Driver Size", value: "40mm Dynamic" },
      { label: "Frequency Response", value: "4 Hz – 40,000 Hz" },
      { label: "Battery Life", value: "45 hrs (ANC on), 60 hrs (ANC off)" },
      { label: "Charging", value: "USB-C, 10 min = 3 hrs" },
      { label: "Weight", value: "253g" },
      { label: "Connectivity", value: "Bluetooth 5.2, 3.5mm jack" },
      { label: "Codec Support", value: "LDAC, AAC, SBC" },
      { label: "Microphones", value: "6-mic array (feed-forward + feed-back)" }
    ],
    reviews: [
      { id: "r1-1", author: "Marcus T.", avatar: "https://i.pravatar.cc/48?img=11", rating: 5, date: "2 days ago", title: "Absolute best ANC on the market", body: "Bought these after trying them in-store. The ANC is genuinely incredible — commute on the subway is finally bearable. Sound is warm, detailed, and wide. Battery lasted almost exactly 45 hours in my test.", verified: true },
      { id: "r1-2", author: "Sarah K.", avatar: "https://i.pravatar.cc/48?img=5", rating: 5, date: "1 week ago", title: "Premium build, premium sound", body: "Came from an older Sony pair and the difference is night and day. The earcups are super comfortable even on 4-hour sessions. Multipoint connection works flawlessly between my laptop and phone.", verified: true },
      { id: "r1-3", author: "Dev R.", avatar: "https://i.pravatar.cc/48?img=17", rating: 4, date: "2 weeks ago", title: "Great, but app is basic", body: "The headphones themselves are a 5/5. The companion app though feels dated compared to Sony or Bose. EQ presets are limited. Still, the hardware more than makes up for it.", verified: false },
      { id: "r1-4", author: "Lisa M.", avatar: "https://i.pravatar.cc/48?img=9", rating: 5, date: "3 weeks ago", title: "Worth every penny", body: "I use these for remote work calls all day. The mic picks up my voice clearly and suppresses background noise well. Colleagues noticed the improvement immediately. Highly recommend.", verified: true }
    ]
  },
  {
    id: "prod-2",
    name: "ChronoLux Classic Automatic Watch",
    description: "A timeless masterpiece featuring an intricate automatic movement, double-domed sapphire glass, and a premium full-grain leather strap.",
    price: 349.00,
    originalPrice: 499.00,
    discount: 30,
    rating: 4.9,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Fashion",
    isDeal: true,
    dealTimer: 18000,
    inStock: true,
    features: ["Japanese Automatic Movement", "50m Water Resistant", "Scratch-Resistant Sapphire Glass", "Genuine Leather Strap"],
    colors: ["#92400e", "#1e293b", "#f1f5f9"],
    sizes: ["36mm", "40mm", "44mm"],
    specs: [
      { label: "Movement", value: "Seiko NH35A Auto, 24 Jewels" },
      { label: "Case Diameter", value: "40mm" },
      { label: "Case Material", value: "316L Stainless Steel" },
      { label: "Crystal", value: "Double-Domed Sapphire AR Coated" },
      { label: "Water Resistance", value: "50m / 5 ATM" },
      { label: "Strap", value: "Full-Grain Calf Leather, 20mm lug" },
      { label: "Lug Width", value: "20mm" },
      { label: "Power Reserve", value: "40+ hours" }
    ],
    reviews: [
      { id: "r2-1", author: "James H.", avatar: "https://i.pravatar.cc/48?img=3", rating: 5, date: "5 days ago", title: "Stunning daily wearer", body: "The dial texture is mesmerizing in sunlight. The Seiko movement hacks (stops seconds hand when crown is pulled) which is rare at this price. Perfectly weighted. Wear it every day.", verified: true },
      { id: "r2-2", author: "Priya S.", avatar: "https://i.pravatar.cc/48?img=20", rating: 5, date: "2 weeks ago", title: "Gift-worthy presentation", body: "Bought as a birthday gift. The packaging is as premium as the watch itself. My partner was blown away. The leather strap has softened beautifully after two weeks of daily wear.", verified: true },
      { id: "r2-3", author: "Tom B.", avatar: "https://i.pravatar.cc/48?img=14", rating: 4, date: "1 month ago", title: "Excellent, minor lume improvement needed", body: "The watch is gorgeous — fit and finish rival pieces twice the price. My only gripe is the lume barely lasts 2 hours. For a daily wearer it's fine, but night-reads are tricky.", verified: false }
    ]
  },
  {
    id: "prod-3",
    name: "NebulaCore VR Headset Ultra",
    description: "Immerse yourself in next-gen virtual reality with stunning 5K resolution, 120Hz refresh rate, and ultra-precise hand tracking.",
    price: 599.99,
    originalPrice: 799.99,
    discount: 25,
    rating: 4.7,
    reviewsCount: 315,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593508512260-264669866164?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Electronics",
    isDeal: true,
    dealTimer: 7200,
    inStock: true,
    features: ["Dual 2.5K OLED Screens", "Precision Hand & Eye Tracking", "Spatial Audio Integration", "Lightweight Comfort Headband"],
    colors: ["#0f172a", "#e2e8f0"],
    specs: [
      { label: "Display", value: "Dual 2.5K OLED per eye" },
      { label: "Refresh Rate", value: "120Hz (90Hz in perf mode)" },
      { label: "Field of View", value: "110° horizontal" },
      { label: "Processor", value: "Snapdragon XR2 Gen 2" },
      { label: "RAM / Storage", value: "12GB / 256GB" },
      { label: "Tracking", value: "6DoF inside-out, hand & eye" },
      { label: "Battery", value: "3 hrs active, 25 hrs standby" },
      { label: "Weight", value: "520g with headband" }
    ],
    reviews: [
      { id: "r3-1", author: "Alex W.", avatar: "https://i.pravatar.cc/48?img=7", rating: 5, date: "3 days ago", title: "Mind-blowing fidelity", body: "The OLED screens completely eliminate the screen-door effect. Hand tracking is responsive enough that I rarely reach for the controllers anymore. This is the future.", verified: true },
      { id: "r3-2", author: "Nina P.", avatar: "https://i.pravatar.cc/48?img=25", rating: 4, date: "1 week ago", title: "Incredible hardware, growing library", body: "Visually there's nothing better at this price. The game library is still catching up compared to the big platforms, but what's there is great quality. Setup was dead simple.", verified: true }
    ]
  },
  {
    id: "prod-4",
    name: "FitTrack Zenith Smart Fitness Band",
    description: "Your ultimate health companion. Monitors blood-oxygen, real-time heart rate, sleep quality, and offers personalized coaching metrics.",
    price: 79.99,
    originalPrice: 119.99,
    discount: 33,
    rating: 4.6,
    reviewsCount: 2150,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Electronics",
    isDeal: true,
    dealTimer: 21600,
    inStock: true,
    features: ["SpO2 & Heart Rate Sensor", "14-Day Battery Life", "5ATM Waterproofing", "30+ Dedicated Activity Modes"],
    colors: ["#0f172a", "#4f46e5", "#16a34a", "#dc2626", "#f97316"],
    sizes: ["S/M", "L/XL"],
    specs: [
      { label: "Display", value: "1.47\" AMOLED, 194×368" },
      { label: "Sensors", value: "PPG, SpO2, Accelerometer, Gyroscope" },
      { label: "Battery", value: "14 days typical, 7 days heavy use" },
      { label: "Water Resistance", value: "5ATM (50m)" },
      { label: "Connectivity", value: "Bluetooth 5.0 BLE" },
      { label: "Compatibility", value: "iOS 14+ / Android 8.0+" },
      { label: "Activity Modes", value: "30+ sport profiles" },
      { label: "Weight", value: "26g with band" }
    ],
    reviews: [
      { id: "r4-1", author: "Chris L.", avatar: "https://i.pravatar.cc/48?img=6", rating: 5, date: "1 day ago", title: "14-day battery is real", body: "Charged it once and 13 days later it's at 18%. With always-on heart rate and sleep tracking. The activity detection is accurate — it correctly logged my morning run without me starting it manually.", verified: true },
      { id: "r4-2", author: "Amara O.", avatar: "https://i.pravatar.cc/48?img=32", rating: 4, date: "4 days ago", title: "Best value fitness tracker", body: "I compared this to the Fitbit Charge at twice the price. The screen is brighter, battery is longer, and sleep tracking is more detailed. App is clean and motivating.", verified: true },
      { id: "r4-3", author: "Ben K.", avatar: "https://i.pravatar.cc/48?img=13", rating: 4, date: "2 weeks ago", title: "Accurate, comfortable, great value", body: "Heart rate matches my chest strap within 2-3 BPM during cardio which is impressive for a wrist device. Comfortable to sleep in. Wish the screen were a bit bigger.", verified: false }
    ]
  },
  {
    id: "prod-5",
    name: "Veloce Carbon Fiber Road Bicycle",
    description: "Built for speed and endurance, featuring a superlight carbon monocoque frame, electronic groupset, and tubeless-ready carbon wheels.",
    price: 1899.00,
    originalPrice: 2499.00,
    discount: 24,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Sports",
    isDeal: true,
    dealTimer: 28800,
    inStock: false,
    features: ["Superlight Carbon Frame", "Wireless Electronic Shifting", "Hydraulic Disc Brakes", "Aero Tubeless-Ready Wheelset"],
    colors: ["#0f172a", "#dc2626", "#f8fafc"],
    sizes: ["XS (49cm)", "S (52cm)", "M (54cm)", "L (56cm)", "XL (58cm)"],
    specs: [
      { label: "Frame", value: "T800 Carbon Monocoque, 820g" },
      { label: "Fork", value: "Full Carbon, Tapered Steerer" },
      { label: "Groupset", value: "12-Speed Electronic Wireless" },
      { label: "Brakes", value: "Hydraulic Disc, 160/140mm rotors" },
      { label: "Wheels", value: "Carbon Tubeless-Ready, 50mm depth" },
      { label: "Tires", value: "28c Tubeless, 700c" },
      { label: "Total Weight", value: "6.9kg (56cm)" },
      { label: "Bottom Bracket", value: "T47 Threaded" }
    ],
    reviews: [
      { id: "r5-1", author: "Marco V.", avatar: "https://i.pravatar.cc/48?img=12", rating: 5, date: "1 week ago", title: "Race-ready out of the box", body: "Took it straight to a group ride and held the front the entire time. The carbon wheels spin up fast and the electronic shifting is instant and precise. Worth every cent.", verified: true },
      { id: "r5-2", author: "Sven J.", avatar: "https://i.pravatar.cc/48?img=22", rating: 5, date: "3 weeks ago", title: "Stiff yet comfortable", body: "The geometry is aggressive without being punishing. 100km rides leave me feeling fresh compared to my old aluminium frame. Hydraulic disc brakes in all weather give huge confidence.", verified: true }
    ]
  },
  {
    id: "prod-6",
    name: "TheraKnead Deep Tissue Massage Gun",
    description: "Relieve muscle tension and speed up recovery with 5 speed levels, 6 interchangeable massage heads, and ultra-quiet brushless motor.",
    price: 129.99,
    originalPrice: 179.99,
    discount: 27,
    rating: 4.8,
    reviewsCount: 856,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Wellness",
    isDeal: false,
    inStock: true,
    features: ["QuietForce Technology", "6-Hour Rechargeable Battery", "5 Ergonomic Speed Levels", "Premium Travel Case Included"],
    colors: ["#0f172a", "#f8fafc", "#16a34a"],
    specs: [
      { label: "Motor", value: "Brushless, 60W" },
      { label: "Speed Levels", value: "5 (1750–3200 PPM)" },
      { label: "Stall Force", value: "60 lbs" },
      { label: "Battery", value: "2550mAh, 6hrs per charge" },
      { label: "Noise Level", value: "40–60 dB" },
      { label: "Attachments", value: "6 interchangeable heads" },
      { label: "Weight", value: "1.1kg" },
      { label: "Charging", value: "USB-C, 2hr full charge" }
    ],
    reviews: [
      { id: "r6-1", author: "Rachel N.", avatar: "https://i.pravatar.cc/48?img=30", rating: 5, date: "3 days ago", title: "Post-workout essential", body: "Used it after leg day and could walk normally the next morning. The quiet motor is legit — can use it while watching TV without turning up the volume. All 6 heads are genuinely useful.", verified: true },
      { id: "r6-2", author: "Dan F.", avatar: "https://i.pravatar.cc/48?img=18", rating: 4, date: "2 weeks ago", title: "Solid build, effective", body: "Stall force is impressive. The lowest speed is perfect for sensitive areas, highest is intense enough to really get into stubborn knots. Travel case is a nice bonus.", verified: true }
    ]
  },
  {
    id: "prod-7",
    name: "OrthoRest Ergonomic Memory Foam Pillow",
    description: "Correct your sleeping posture. Contoured design cradles your head, neck, and shoulders, ensuring a pain-free morning.",
    price: 49.99,
    originalPrice: 69.99,
    discount: 28,
    rating: 4.5,
    reviewsCount: 1420,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Home",
    isDeal: false,
    inStock: true,
    features: ["CertiPUR-US Memory Foam", "Dynamic Contoured Support", "Breathable Bamboo Outer Cover", "Hypoallergenic & Dust-Mite Resistant"],
    colors: ["#f8fafc", "#fef3c7", "#f0fdf4"],
    sizes: ["Standard (60x40cm)", "Queen (70x45cm)"],
    specs: [
      { label: "Material", value: "CertiPUR-US Certified Memory Foam" },
      { label: "Cover", value: "40% Bamboo, 60% Polyester" },
      { label: "Dimensions", value: "60 × 40 × 12cm (Standard)" },
      { label: "Density", value: "50 kg/m³ HR Foam" },
      { label: "Washable Cover", value: "Yes, machine washable 30°C" },
      { label: "Allergen Free", value: "Hypoallergenic, dust-mite resistant" },
      { label: "Firmness", value: "Medium-Firm" },
      { label: "Warranty", value: "5-year manufacturer warranty" }
    ],
    reviews: [
      { id: "r7-1", author: "Emma S.", avatar: "https://i.pravatar.cc/48?img=29", rating: 5, date: "1 week ago", title: "No more neck pain", body: "I've had neck pain for years from bad pillow choices. After a week with this I wake up without stiffness for the first time in memory. The contour perfectly supports my cervical curve.", verified: true },
      { id: "r7-2", author: "Michael T.", avatar: "https://i.pravatar.cc/48?img=15", rating: 4, date: "3 weeks ago", title: "Excellent, slight off-gassing initially", body: "Great pillow, noticeable improvement in sleep quality. The first 2-3 nights there was a slight foam smell — left it to air out and it was completely gone by day 4.", verified: false }
    ]
  },
  {
    id: "prod-8",
    name: "BrewMaster Smart Espresso Machine",
    description: "Brew barista-quality espresso, lattes, and cappuccinos from your phone. Features built-in conical grinder and precise PID temperature control.",
    price: 699.99,
    originalPrice: 899.99,
    discount: 22,
    rating: 4.9,
    reviewsCount: 540,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Home",
    isDeal: false,
    inStock: true,
    features: ["Built-In Conical Burr Grinder", "PID Temperature Stability", "WiFi Companion App Control", "Powerful Steam Wand"],
    colors: ["#1c1917", "#f5f5f4", "#be185d"],
    specs: [
      { label: "Boiler", value: "Dual Boiler, 1.8L + 0.75L" },
      { label: "Pump Pressure", value: "9 Bar (adjustable)" },
      { label: "Grinder", value: "Conical Burr, 30 grind settings" },
      { label: "Temperature Control", value: "PID ±0.1°C accuracy" },
      { label: "Connectivity", value: "WiFi 802.11 b/g/n, Bluetooth 5.0" },
      { label: "Steam Wand", value: "360° articulating, auto-froth mode" },
      { label: "Tank Capacity", value: "2.5L removable" },
      { label: "Dimensions", value: "38 × 31 × 42cm (H×W×D)" }
    ],
    reviews: [
      { id: "r8-1", author: "Carla B.", avatar: "https://i.pravatar.cc/48?img=23", rating: 5, date: "2 days ago", title: "Replaced my £1200 machine", body: "I was skeptical but this pulls espresso as well as my previous high-end machine. The PID stability is real — shot consistency is remarkable. Built-in grinder saves so much counter space.", verified: true },
      { id: "r8-2", author: "Yusuf A.", avatar: "https://i.pravatar.cc/48?img=8", rating: 5, date: "10 days ago", title: "App control is genuinely useful", body: "Scheduled it to pre-heat every morning. Wake up, press once, espresso in 30 seconds. The shot timer in the app helped me dial in my grind in an afternoon. Exceptional machine.", verified: true },
      { id: "r8-3", author: "Helen W.", avatar: "https://i.pravatar.cc/48?img=27", rating: 4, date: "1 month ago", title: "Learning curve but worth it", body: "Takes a week to dial in but the payoff is real. The steam wand produces silky microfoam once you get the technique down. Comprehensive manual and active online community help a lot.", verified: false }
    ]
  },
  {
    id: "prod-9",
    name: "AuraGlow LED Ambient Bedside Lamp",
    description: "Set the mood with 16 million colors, touch tap controls, smart home integration, and relaxing white noise soundscapes.",
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    rating: 4.6,
    reviewsCount: 890,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Home",
    isDeal: false,
    inStock: true,
    features: ["16M RGB Dynamic Colors", "Built-In White Noise Engine", "Apple Home & Alexa Compatible", "Touch-Sensitive Base"],
    colors: ["#f8fafc", "#fef9c3", "#f0fdf4"],
    specs: [
      { label: "LED Type", value: "RGB+W, 16 million colors" },
      { label: "Brightness", value: "800 lumens max" },
      { label: "Color Temp", value: "2700K–6500K tunable white" },
      { label: "Control", value: "Touch base, app, voice assistant" },
      { label: "Connectivity", value: "WiFi 2.4GHz, no hub required" },
      { label: "Sound Engine", value: "8 white noise profiles" },
      { label: "Power", value: "12W, USB-C powered" },
      { label: "Compatibility", value: "Apple HomeKit, Alexa, Google Home" }
    ],
    reviews: [
      { id: "r9-1", author: "Sophie L.", avatar: "https://i.pravatar.cc/48?img=26", rating: 5, date: "5 days ago", title: "Perfect bedside ambiance", body: "The warm white mode at 20% brightness is the perfect reading light. The sunrise wake-up feature gradually brightens over 30 minutes — I wake up naturally now without an alarm blaring.", verified: true },
      { id: "r9-2", author: "Ryan C.", avatar: "https://i.pravatar.cc/48?img=4", rating: 4, date: "2 weeks ago", title: "Smart home integration is flawless", body: "Pairs with HomeKit instantly. Siri scenes work perfectly. The white noise sounds are genuinely good — not just simple loops. Baby sleeps through the night with rain sounds on.", verified: true }
    ]
  },
  {
    id: "prod-10",
    name: "Nomad Explorer Waterproof Backpack",
    description: "Heavy-duty waterproof travel backpack featuring modular compartments, an integrated USB charging port, and a hidden anti-theft pocket.",
    price: 89.99,
    originalPrice: 129.99,
    discount: 30,
    rating: 4.7,
    reviewsCount: 680,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Fashion",
    isDeal: false,
    inStock: true,
    features: ["IPX6 Waterproof Rating", "Fits Up to 17\" Laptop", "Integrated USB Port", "Anti-Theft Hidden Pocket"],
    colors: ["#1e293b", "#334155", "#166534", "#7c2d12"],
    specs: [
      { label: "Material", value: "600D Oxford + PU Laminate" },
      { label: "Waterproofing", value: "IPX6 sealed zippers & seams" },
      { label: "Capacity", value: "35L" },
      { label: "Laptop Compartment", value: "Up to 17\", padded sleeve" },
      { label: "USB Port", value: "External, pass-through charging" },
      { label: "Dimensions", value: "50 × 32 × 18cm" },
      { label: "Weight", value: "0.95kg empty" },
      { label: "Back Panel", value: "Ventilated mesh, padded" }
    ],
    reviews: [
      { id: "r10-1", author: "Jake M.", avatar: "https://i.pravatar.cc/48?img=16", rating: 5, date: "4 days ago", title: "Survived a downpour, laptop dry", body: "Got caught in heavy rain cycling to work. Laptop, passport, and everything inside was completely dry. The build quality feels like it'll last a decade. Organization is excellent.", verified: true },
      { id: "r10-2", author: "Aisha R.", avatar: "https://i.pravatar.cc/48?img=31", rating: 4, date: "3 weeks ago", title: "Best travel bag I've owned", body: "Carries everything I need for a 3-day trip as carry-on. Anti-theft pocket genuinely hidden — even I forget it's there. The USB passthrough is handy at airports.", verified: true }
    ]
  },
  {
    id: "prod-11",
    name: "Lumina 4K Ultra-Short Throw Projector",
    description: "Transform your living room into a cinema. Displays a sharp 120-inch screen from just inches away, with HDR10+ and Dolby Audio.",
    price: 1299.00,
    originalPrice: 1699.00,
    discount: 23,
    rating: 4.8,
    reviewsCount: 145,
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574267431644-4ed22da99528?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Electronics",
    isDeal: false,
    inStock: true,
    features: ["4K UHD Laser Engine", "0.23 Ultra-Short Throw Ratio", "2500 ANSI Lumens Brightness", "Harman Kardon Spatial Audio"],
    colors: ["#f8fafc", "#1c1917"],
    specs: [
      { label: "Resolution", value: "3840 × 2160 (4K UHD)" },
      { label: "Light Source", value: "Triple Laser, 25,000 hrs" },
      { label: "Brightness", value: "2500 ANSI Lumens" },
      { label: "Throw Ratio", value: "0.23:1 (120\" from 30cm)" },
      { label: "HDR", value: "HDR10+, HLG, Dolby Vision" },
      { label: "Audio", value: "40W Harman Kardon, Dolby Atmos" },
      { label: "OS", value: "Google TV built-in" },
      { label: "Ports", value: "3× HDMI 2.1, 2× USB-A, eARC" }
    ],
    reviews: [
      { id: "r11-1", author: "David C.", avatar: "https://i.pravatar.cc/48?img=19", rating: 5, date: "1 week ago", title: "Cinema in my apartment", body: "120 inches on my wall from 28cm away. 4K is genuinely sharp at this size. Harman Kardon speakers are loud and wide — movies feel like the cinema. Google TV means every app is built in.", verified: true },
      { id: "r11-2", author: "Mei L.", avatar: "https://i.pravatar.cc/48?img=33", rating: 4, date: "2 weeks ago", title: "Stunning, needs dim room", body: "In a dark room it's breathtaking. With curtains open in daytime the 2500 lumens still washes out. Buy this for evening use and you'll be thrilled. Calibration was straightforward.", verified: true }
    ]
  },
  {
    id: "prod-12",
    name: "HydroFlask Pro Double-Wall Water Bottle",
    description: "Keep beverages ice-cold for 24 hours or hot for 12. Durable pro-grade stainless steel with leakproof flex-straw lid.",
    price: 34.99,
    originalPrice: 45.00,
    discount: 22,
    rating: 4.7,
    reviewsCount: 3400,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Sports",
    isDeal: false,
    inStock: true,
    features: ["TempShield Double-Wall Vacuum", "18/8 Pro-Grade Stainless Steel", "BPA-Free & Toxin-Free", "Leakproof Straw Lid Included"],
    colors: ["#64748b", "#dc2626", "#16a34a", "#4f46e5", "#f97316", "#0f172a"],
    sizes: ["18oz", "32oz", "40oz", "64oz"],
    specs: [
      { label: "Material", value: "18/8 Pro-Grade Stainless Steel" },
      { label: "Insulation", value: "TempShield double-wall vacuum" },
      { label: "Cold Retention", value: "24+ hours" },
      { label: "Hot Retention", value: "12+ hours" },
      { label: "Capacity", value: "32oz (946ml) — standard" },
      { label: "Lid", value: "Flex Straw, leakproof" },
      { label: "Coating", value: "Powder coat, chip-resistant" },
      { label: "BPA Free", value: "Yes, toxin-free" }
    ],
    reviews: [
      { id: "r12-1", author: "Olivia K.", avatar: "https://i.pravatar.cc/48?img=28", rating: 5, date: "2 days ago", title: "Ice lasted 26 hours", body: "Put ice in at 8am, still had ice at 10am the next day in a hot car. The powder coat is tough — no dents after dropping on concrete twice. Best bottle I've bought in 10 years.", verified: true },
      { id: "r12-2", author: "Tom R.", avatar: "https://i.pravatar.cc/48?img=10", rating: 4, date: "1 week ago", title: "Premium feel, worth the price", body: "The weight and lid click both feel premium. Hot tea was still scalding at hour 8. Only note: hand-wash only, dishwasher can damage the powder coat over time.", verified: true }
    ]
  },
  {
    id: "prod-13",
    name: "SereneGlow Premium Lavender Candle Set",
    description: "Indulge in relaxation. Hand-poured organic soy wax candles infused with French lavender, chamomile, and cedarwood essential oils.",
    price: 24.99,
    originalPrice: 35.00,
    discount: 28,
    rating: 4.5,
    reviewsCount: 620,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596433809252-260c2745df6b?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Wellness",
    isDeal: false,
    inStock: true,
    features: ["100% Natural Organic Soy Wax", "Pure Essential Oil Infused", "Lead-Free Cotton Wicks", "50+ Hours Burning Time Per Jar"],
    colors: ["#f3e8ff", "#fef9c3", "#f0fdf4"],
    sizes: ["Small (150g)", "Medium (240g)", "Large (360g)"],
    specs: [
      { label: "Wax Type", value: "100% Organic Soy Wax" },
      { label: "Fragrance", value: "Pure essential oils (no synthetics)" },
      { label: "Scent Profile", value: "French Lavender, Chamomile, Cedarwood" },
      { label: "Wick", value: "Lead-free cotton, pre-waxed" },
      { label: "Burn Time", value: "50+ hrs per 240g jar" },
      { label: "Jar", value: "Reusable amber glass" },
      { label: "Set Contents", value: "3 × 240g jars" },
      { label: "Made In", value: "Hand-poured, USA" }
    ],
    reviews: [
      { id: "r13-1", author: "Jess T.", avatar: "https://i.pravatar.cc/48?img=21", rating: 5, date: "3 days ago", title: "Heavenly scent, clean burn", body: "No black smoke, no tunnelling — perfect burn every time. The lavender scent fills my bedroom without being overpowering. The amber jars look beautiful as decor even when unlit.", verified: true },
      { id: "r13-2", author: "Kate F.", avatar: "https://i.pravatar.cc/48?img=24", rating: 4, date: "2 weeks ago", title: "Excellent gift packaging", body: "Bought as a gift set — the box presentation is gorgeous. Recipient absolutely loved it. Scent throw in a large room could be stronger but for bedrooms it's perfect.", verified: false }
    ]
  },
  {
    id: "prod-14",
    name: "Ecoscape Sustainable Organic Cotton Tee",
    description: "Ultra-soft and sustainably made. Sourced from 100% organic cotton under fair-trade conditions. Perfect casual wear.",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    rating: 4.4,
    reviewsCount: 1100,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Fashion",
    isDeal: false,
    inStock: true,
    features: ["100% GOTS Certified Organic Cotton", "Ethically Made (Fair-Trade)", "Pre-Shrunk Premium Soft Knit", "Eco-Friendly Non-Toxic Dyes"],
    colors: ["#f8fafc", "#1e293b", "#4f46e5", "#16a34a", "#dc2626", "#f97316"],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    specs: [
      { label: "Material", value: "100% GOTS Certified Organic Cotton" },
      { label: "Weight", value: "180 gsm" },
      { label: "Certification", value: "GOTS, Fair-Trade, OEKO-TEX" },
      { label: "Dyes", value: "OEKO-TEX safe, non-toxic" },
      { label: "Fit", value: "Classic unisex relaxed fit" },
      { label: "Pre-Shrunk", value: "Yes, <2% residual shrink" },
      { label: "Care", value: "Machine wash 30°C, tumble dry low" },
      { label: "Made In", value: "Portugal" }
    ],
    reviews: [
      { id: "r14-1", author: "Fiona G.", avatar: "https://i.pravatar.cc/48?img=35", rating: 5, date: "6 days ago", title: "Softest tee I own", body: "The fabric feels incredible — like a well-worn favorite tee but brand new. Washed 10 times and no change in shape or softness. The colors are rich and still vibrant. My new go-to basics brand.", verified: true },
      { id: "r14-2", author: "Noah C.", avatar: "https://i.pravatar.cc/48?img=36", rating: 4, date: "3 weeks ago", title: "Great quality, size up", body: "I'm usually a Medium and the Large fits perfectly relaxed. Size is slightly smaller than US brands so go one up. Quality is exceptional for the price, really sustainable too.", verified: true }
    ]
  },
  {
    id: "prod-15",
    name: "KeyChron K2 Mechanical Keyboard V2",
    description: "A compact 84-key wireless mechanical keyboard featuring hot-swappable switches, Gateron brown switches, and stunning RGB backlighting.",
    price: 89.00,
    originalPrice: 119.00,
    discount: 25,
    rating: 4.8,
    reviewsCount: 1650,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Electronics",
    isDeal: false,
    inStock: true,
    features: ["Hot-Swappable Switch Design", "Wireless Bluetooth or Wired USB", "Dual macOS & Windows Support", "4000mAh High-Capacity Battery"],
    colors: ["#1c1917", "#f5f5f4"],
    specs: [
      { label: "Layout", value: "84-key TKL (75%)" },
      { label: "Switch", value: "Gateron Brown (hot-swappable)" },
      { label: "Wireless", value: "Bluetooth 5.1, multi-device ×3" },
      { label: "Wired", value: "USB-C detachable cable" },
      { label: "Battery", value: "4000mAh, ~4 weeks RGB off" },
      { label: "Backlighting", value: "Per-key RGB LED" },
      { label: "Keycaps", value: "Double-shot PBT, OSA profile" },
      { label: "Compatibility", value: "macOS & Windows (dual layout)" }
    ],
    reviews: [
      { id: "r15-1", author: "Kai S.", avatar: "https://i.pravatar.cc/48?img=37", rating: 5, date: "4 days ago", title: "Best keyboard under $100", body: "Hot-swap support is the killer feature — swapped to lubed Boba U4 silents in 20 minutes. Build quality is solid, zero flex. The macOS layout is actually correct unlike cheaper boards.", verified: true },
      { id: "r15-2", author: "Isla B.", avatar: "https://i.pravatar.cc/48?img=38", rating: 5, date: "2 weeks ago", title: "Converted me to mechanical", body: "Never used a mechanical keyboard before. The brown switches are tactile but quiet enough for an office. Typing speed and accuracy improved noticeably. Now I can't go back.", verified: true },
      { id: "r15-3", author: "Greg P.", avatar: "https://i.pravatar.cc/48?img=39", rating: 4, date: "1 month ago", title: "Great, Bluetooth latency is fine", body: "Gaming-grade wireless this is not, but for coding and writing the BT latency is completely unnoticeable. Battery genuinely lasts weeks. Excellent value and endlessly upgradeable.", verified: false }
    ]
  },
  {
    id: "prod-16",
    name: "ApexGrip Precision Wireless Gaming Mouse",
    description: "Engineered for competitive play. Weighs only 60g, has a 26k DPI optical sensor, and lag-free sub-millisecond wireless performance.",
    price: 99.99,
    originalPrice: 139.99,
    discount: 28,
    rating: 4.7,
    reviewsCount: 780,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617900906639-cab7adceb704?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Electronics",
    isDeal: false,
    inStock: true,
    features: ["Ultra-Lightweight 60g Chassis", "26,000 DPI Optical Sensor", "Sub-1ms Lag-Free Wireless", "80-Hour Continuous Battery Life"],
    colors: ["#0f172a", "#f8fafc", "#dc2626"],
    specs: [
      { label: "Sensor", value: "26,000 DPI Optical (PAW3395)" },
      { label: "IPS / Acceleration", value: "650 IPS / 50G" },
      { label: "Wireless", value: "Sub-1ms 2.4GHz dongle" },
      { label: "Battery", value: "80 hrs (wireless), USB-C charge" },
      { label: "Switches", value: "Optical, rated 100M clicks" },
      { label: "Weight", value: "60g (no cable)" },
      { label: "Polling Rate", value: "1000Hz wired / 2000Hz in Turbo" },
      { label: "RGB", value: "Onboard 16.8M color lighting" }
    ],
    reviews: [
      { id: "r16-1", author: "Luis G.", avatar: "https://i.pravatar.cc/48?img=40", rating: 5, date: "1 day ago", title: "Unreal sensor, negligible weight", body: "The PAW3395 sensor tracks perfectly even at 26K DPI — zero prediction, zero smoothing. At 60g it genuinely disappears. Won my first LAN tournament with this mouse.", verified: true },
      { id: "r16-2", author: "Anna W.", avatar: "https://i.pravatar.cc/48?img=41", rating: 5, date: "5 days ago", title: "Converted from a wired mouse", body: "I was sceptical about wireless for competitive gaming but sub-1ms is truly imperceptible. The 80-hour battery means I charge it once a week. Shape is comfortable for palm and claw grip.", verified: true },
      { id: "r16-3", author: "Kevin H.", avatar: "https://i.pravatar.cc/48?img=42", rating: 4, date: "3 weeks ago", title: "Premium performance, plain look", body: "Pure performance mouse. The shell has no texture or patterns — if you want flash go elsewhere. If you want the best tracking and lowest latency at this price it's unmatched.", verified: false }
    ]
  },
];
