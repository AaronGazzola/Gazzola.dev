import { parseThemesFromCSS } from './app/(components)/ThemeConfiguration.utils.ts';

const themes = parseThemesFromCSS();

console.log('Total themes:', themes.length);
console.log('\nFirst 3 themes with primary colors:');
themes.slice(0, 3).forEach((theme, idx) => {
  console.log(`\n${idx}. ${theme.name}`);
  console.log(`   Light primary: ${theme.light.colors.primary}`);
  console.log(`   Dark primary: ${theme.dark.colors.primary}`);
});
