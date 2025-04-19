# Solar Explorer 🚀

![Solar Explorer](https://res.cloudinary.com/dqqyuvg1v/image/upload/v1745042336/waste2way/mif3awhydzpz4d4hp6af.jpg)
_Explore our vast solar system in stunning 3D visualization_

An interactive 3D solar system visualization built with Next.js and Three.js that allows users to explore planets in our solar system with detailed information and interactive features. Perfect for education, astronomy enthusiasts, or anyone curious about space.

## ✨ Features

- **Interactive 3D Solar System**: Navigate through a visually stunning representation of our solar system with accurate planetary positions and orbits
- **Detailed Planet Information**: Explore individual planets with scientific data, high-resolution textures, and fascinating fun facts
- **Realistic Orbital Mechanics**: Planets follow accurate elliptical orbits with proper scale and speed based on astronomical data
- **Special Celestial Objects**: Includes features like asteroid belts, comets, and other space phenomena
- **Adjustable Simulation Controls**: Change orbit speed, pause the simulation, toggle planet labels, and reset the view
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Dark/Light Mode Support**: Choose your preferred viewing experience with system theme detection
- **Audio Integration**: Optional ambient space soundscape with volume controls

## 🛠️ Prerequisites

Before installing, make sure you have:

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun package manager

## 🚀 Technologies Used

- **Next.js 15.3.0**: React framework for building the application
- **React Three Fiber & Drei**: For 3D rendering and effects
- **Three.js**: WebGL-based 3D graphics library
- **Tailwind CSS**: For styling and responsive design
- **TypeScript**: For type-safe code
- **Shadcn UI**: For accessible, customizable UI components

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/project-lancelot.git
cd project-lancelot
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
project-lancelot/
├── app/                  # Next.js app directory
│   ├── about/            # About page
│   ├── planet/[id]/      # Dynamic planet detail pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Homepage
├── components/           # React components
│   ├── ui/               # Reusable UI components
│   ├── navbar.tsx        # Navigation component
│   ├── solar-system.tsx  # Main 3D solar system component
│   └── ...
├── lib/                  # Utility functions and data
│   ├── planet-data.ts    # Planet information
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## Usage

### Solar System View

The main view displays the entire solar system with interactive planets. You can:

- Click on any planet to navigate to its detail page
- Adjust the orbit speed using the slider
- Play/pause the simulation
- Toggle planet labels
- Reset the view

### Planet Detail View

Each planet has a dedicated page showing:

- An interactive 3D model of the planet
- Scientific information including size, day length, and orbit period
- Fun facts about the planet

### Navigation

Use the navbar to quickly jump between planets or return to the solar system view.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
