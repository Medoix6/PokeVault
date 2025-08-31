# PokeVault

A modern Vue.js app to browse, search, and edit Pokémon details using Pinia for state management.

## Features

- Browse a list of Pokémon
- View detailed info for each Pokémon
- Edit Pokémon details (name, description, height, weight)
- State is managed and persisted with Pinia

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Medoix6/PokeVault.git
   cd PokeVault
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the development server:**

   ```sh
   npm run serve
   ```

   The app will be available at `http://localhost:8080` (or the port shown in your terminal).

4. **Build for production:**
   ```sh
   npm run build
   ```
   The production-ready files will be in the `dist/` folder.

## Project Structure

- `src/` - Main source code
  - `components/` - Vue components
  - `datastore/` - Pinia store
  - `pages/` - App pages (Home, PokemonDetail)
  - `routes/` - Vue Router setup
- `public/` - Static assets

## Notes

- Pokémon data is fetched from the [PokeAPI](https://pokeapi.co/).
- Edited Pokémon info is saved in your browser's localStorage.

## License

MIT
