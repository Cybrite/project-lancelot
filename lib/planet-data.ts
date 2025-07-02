export const PLANETS = [
  {
    id: "mercury",
    name: "Mercury",
    description:
      "The smallest and innermost planet in the Solar System. Mercury is a rocky planet with a heavily cratered surface similar to the Moon.",
    size: 0.8,
    realSize: "4,879 km",
    orbitDistance: 10,
    orbitSpeed: 4.1,
    rotationPeriod: "58.6 days",
    orbitPeriod: "88 days",
    color: "#A9A9A9",
    texturePath:
      "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1744570775/merciry_texture_wlo6bs.svg",
    funFacts: [
      "Mercury has no atmosphere, which means there is no wind or weather.",
      "Despite being the closest planet to the Sun, it's not the hottest (Venus is).",
      "A day on Mercury (sunrise to sunrise) lasts 176 Earth days.",
      "Mercury's surface temperature varies from -173°C to 427°C.",
    ],
    moons: [],
  },
  {
    id: "venus",
    name: "Venus",
    description:
      "Venus is the second planet from the Sun and is often called Earth's 'sister planet' due to their similar size and mass. It has a thick toxic atmosphere filled with carbon dioxide and clouds of sulfuric acid.",
    size: 1.2,
    realSize: "12,104 km",
    orbitDistance: 15,
    orbitSpeed: 1.6,
    rotationPeriod: "243 days",
    orbitPeriod: "225 days",
    color: "#E6E6FA",
    texturePath:
      "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1744570748/venus_so0uim.svg",
    funFacts: [
      "Venus rotates backward compared to other planets.",
      "It's the hottest planet with a surface temperature of about 475°C.",
      "The atmospheric pressure on Venus is 92 times that of Earth.",
      "Venus has more volcanoes than any other planet in our solar system.",
    ],
    moons: [],
  },
  {
    id: "earth",
    name: "Earth",
    description:
      "Our home planet and the only known celestial body to harbor life. Earth has a dynamic atmosphere, diverse ecosystems, and is the only planet with liquid water on its surface.",
    size: 1.3,
    realSize: "12,742 km",
    orbitDistance: 20,
    orbitSpeed: 1.0,
    rotationPeriod: "24 hours",
    orbitPeriod: "365.25 days",
    color: "#1E90FF",
    texturePath:
      "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1744570745/earth_m2lpzg.svg",
    funFacts: [
      "Earth is the only planet not named after a god or goddess.",
      "71% of Earth's surface is covered by water.",
      "Earth's atmosphere is composed of 78% nitrogen and 21% oxygen.",
      "Earth's magnetic field protects us from harmful solar radiation.",
    ],
    moons: [
      {
        id: "moon",
        name: "Moon",
        color: "#C0C0C0",
        size: 0.3,
        orbitDistance: 2,
        orbitSpeed: 0.5,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457028/moom_h2ju0v.jpg",
      },
    ],
  },
  {
    id: "mars",
    name: "Mars",
    description:
      "Known as the Red Planet due to its reddish appearance, Mars is a cold desert world with a thin atmosphere. It has seasons, polar ice caps, canyons, extinct volcanoes, and evidence of ancient rivers and lakes.",
    size: 0.9,
    realSize: "6,779 km",
    orbitDistance: 25,
    orbitSpeed: 0.5,
    rotationPeriod: "24.6 hours",
    orbitPeriod: "687 days",
    color: "#FF4500",
    texturePath:
      "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1744570746/mars_ovpzdd.svg",
    funFacts: [
      "Mars has the largest volcano in the solar system, Olympus Mons.",
      "Mars has two small moons, Phobos and Deimos.",
      "The red color comes from iron oxide (rust) on its surface.",
      "Mars experiences dust storms that can cover the entire planet.",
    ],
    moons: [
      {
        id: "phobos",
        name: "Phobos",
        color: "#A0522D",
        size: 0.1,
        orbitDistance: 1.5,
        orbitSpeed: 0.8,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457028/phobos_qwek6t.jpg",
      },
      {
        id: "deimos",
        name: "Deimos",
        color: "#8B4513",
        size: 0.08,
        orbitDistance: 2.5,
        orbitSpeed: 0.6,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457028/deimos_drcbq5.jpg",
      },
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    description:
      "Jupiter is the largest planet in our solar system and is primarily composed of hydrogen and helium. It's known for its Great Red Spot, a giant storm that has been raging for hundreds of years.",
    size: 2.5,
    realSize: "139,820 km",
    orbitDistance: 35,
    orbitSpeed: 0.08,
    rotationPeriod: "9.9 hours",
    orbitPeriod: "11.9 years",
    color: "#F5DEB3",
    texturePath:
      "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1744570747/jupiter_sbb3xb.svg",
    funFacts: [
      "Jupiter has the shortest day of all the planets, rotating once every 10 hours.",
      "The Great Red Spot is a storm that could fit 3 Earths inside it.",
      "Jupiter has at least 79 moons, including the four large Galilean moons.",
      "Jupiter's magnetic field is 14 times stronger than Earth's.",
    ],
    moons: [
      {
        id: "io",
        name: "Io",
        color: "#FFA500",
        size: 0.2,
        orbitDistance: 3,
        orbitSpeed: 0.7,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457716/Io_e6mmej.jpg",
      },
      {
        id: "europa",
        name: "Europa",
        color: "#F0F8FF",
        size: 0.18,
        orbitDistance: 4,
        orbitSpeed: 0.6,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457716/europa_sfeqor.jpg",
      },
      {
        id: "ganymede",
        name: "Ganymede",
        color: "#D3D3D3",
        size: 0.25,
        orbitDistance: 5,
        orbitSpeed: 0.5,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457716/genmede_meptzm.jpg",
      },
      {
        id: "callisto",
        name: "Callisto",
        color: "#A9A9A9",
        size: 0.22,
        orbitDistance: 6,
        orbitSpeed: 0.4,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457716/callisto_bh3d6h.jpg",
      },
    ],
  },
  {
    id: "saturn",
    name: "Saturn",
    description:
      "Saturn is famous for its stunning ring system, which consists of ice particles, rocky debris, and dust. It's a gas giant primarily composed of hydrogen and helium.",
    size: 2.2,
    realSize: "116,460 km",
    orbitDistance: 45,
    orbitSpeed: 0.03,
    rotationPeriod: "10.7 hours",
    orbitPeriod: "29.5 years",
    color: "#F0E68C",
    texturePath:
      "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1744570745/saturn_luzgvs.svg",
    funFacts: [
      "Saturn's rings extend up to 175,000 miles from the planet but are only about 30 feet thick.",
      "Saturn has at least 82 moons, with Titan being the largest.",
      "Saturn is the least dense planet in our solar system—it would float in water.",
      "The wind speeds on Saturn can reach up to 1,800 km/h.",
    ],
    moons: [
      {
        id: "titan",
        name: "Titan",
        color: "#DAA520",
        size: 0.3,
        orbitDistance: 4,
        orbitSpeed: 0.4,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457957/titan_wfoy1x.jpg",
      },
      {
        id: "rhea",
        name: "Rhea",
        color: "#C0C0C0",
        size: 0.15,
        orbitDistance: 5,
        orbitSpeed: 0.3,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457957/rhea_izmlxa.jpg",
      },
    ],
  },
  {
    id: "uranus",
    name: "Uranus",
    description:
      "Uranus is an ice giant with a unique feature: it rotates on its side, likely due to a massive collision in its past. It appears blue-green due to methane in its atmosphere.",
    size: 1.8,
    realSize: "50,724 km",
    orbitDistance: 55,
    orbitSpeed: 0.01,
    rotationPeriod: "17.2 hours",
    orbitPeriod: "84 years",
    color: "#00FFFF",
    texturePath:
      "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1744570745/uranus_giwtx7.svg",
    funFacts: [
      "Uranus rotates on its side with an axial tilt of about 98 degrees.",
      "It has 13 known rings, which are much fainter than Saturn's.",
      "Uranus has 27 known moons, named after characters from Shakespeare and Pope.",
      "It's the coldest planet in our solar system with a minimum temperature of -224°C.",
    ],
    moons: [
      {
        id: "titania",
        name: "Titania",
        color: "#B0E0E6",
        size: 0.15,
        orbitDistance: 3,
        orbitSpeed: 0.3,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457957/titania_nen3zg.jpg",
      },
      {
        id: "oberon",
        name: "Oberon",
        color: "#87CEEB",
        size: 0.14,
        orbitDistance: 4,
        orbitSpeed: 0.25,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457957/oberon_sgyddh.jpg",
      },
    ],
  },
  {
    id: "neptune",
    name: "Neptune",
    description:
      "Neptune is the farthest planet from the Sun and is characterized by its vivid blue color caused by methane in its atmosphere. It's known for its strong winds and storms.",
    size: 1.7,
    realSize: "49,244 km",
    orbitDistance: 65,
    orbitSpeed: 0.006,
    rotationPeriod: "16.1 hours",
    orbitPeriod: "165 years",
    color: "#4169E1",
    texturePath:
      "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1744570746/neptune_con1ja.svg",
    funFacts: [
      "Neptune has the strongest winds in the solar system, reaching up to 2,100 km/h.",
      "It was the first planet to be predicted mathematically before being observed.",
      "Neptune has 14 known moons, with Triton being the largest.",
      "It has a Great Dark Spot, similar to Jupiter's Great Red Spot.",
    ],
    moons: [
      {
        id: "triton",
        name: "Triton",
        color: "#1E90FF",
        size: 0.2,
        orbitDistance: 3,
        orbitSpeed: 0.2,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457956/triton_sam3mr.jpg",
      },
      {
        id: "nereid",
        name: "Nereid",
        color: "#87CEFA",
        size: 0.1,
        orbitDistance: 4,
        orbitSpeed: 0.15,
        texturePath:
          "https://res.cloudinary.com/dqqyuvg1v/image/upload/v1746457956/nereid_czmcwy.jpg",
      },
    ],
  },
];
