/**
 * CINEMAVERSE TAXONOMY — GENERATED FILE. DO NOT EDIT BY HAND.
 * Regenerate with: npm run catalog   (scripts/build-catalog.mjs)
 *
 * Country, language and region metadata for every film in the catalogue.
 */

export const COUNTRIES = [
  { name: "United States", language: "English", region: "North America" },
  { name: "United Kingdom", language: "English", region: "Europe" },
  { name: "France", language: "French", region: "Europe" },
  { name: "Italy", language: "Italian", region: "Europe" },
  { name: "Spain", language: "Spanish", region: "Europe" },
  { name: "Germany", language: "German", region: "Europe" },
  { name: "Japan", language: "Japanese", region: "Asia" },
  { name: "South Korea", language: "Korean", region: "Asia" },
  { name: "China", language: "Mandarin", region: "Asia" },
  { name: "India", language: "Hindi", region: "Asia" },
  { name: "Russia", language: "Russian", region: "Europe" },
  { name: "Brazil", language: "Portuguese", region: "South America" },
  { name: "Mexico", language: "Spanish", region: "North America" },
  { name: "Canada", language: "English", region: "North America" },
  { name: "Sweden", language: "Swedish", region: "Europe" },
  { name: "Denmark", language: "Danish", region: "Europe" },
  { name: "Poland", language: "Polish", region: "Europe" },
  { name: "Netherlands", language: "Dutch", region: "Europe" },
  { name: "Turkey", language: "Turkish", region: "Europe" },
  { name: "Iran", language: "Persian", region: "Asia" },
  { name: "Nigeria", language: "English", region: "Africa" },
  { name: "Australia", language: "English", region: "Oceania" },
  { name: "Argentina", language: "Spanish", region: "South America" },
]

export const GENRES = ["Action","Adventure","Animation","Biography","Comedy","Crime","Documentary","Drama","Family","Fantasy","History","Horror","Music","Mystery","Romance","Sci-Fi","Thriller","War","Western"]

export const COUNTRY_BY_NAME = new Map(COUNTRIES.map((country) => [country.name, country]))

export default COUNTRIES
