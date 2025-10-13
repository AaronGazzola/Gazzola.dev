const data = require('./public/data/processed-markdown.json');

const pages = Object.values(data.flatIndex)
  .filter(node => node.type === 'file' && node.include !== false && !node.previewOnly)
  .sort((a,b) => (a.order||0)-(b.order||0));

console.log('First page after fix:');
console.log(`  Path: ${pages[0].path}`);
console.log(`  URL: ${pages[0].urlPath}`);
console.log(`  Order: ${pages[0].order}`);

console.log('\nAll non-preview pages:');
pages.forEach((page, i) => {
  console.log(`${i+1}. ${page.path} -> ${page.urlPath} (order: ${page.order || 'none'})`);
});
