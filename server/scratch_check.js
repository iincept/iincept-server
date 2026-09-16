const mongoose = require('./server/node_modules/mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/iincept').then(async () => {
  const Setting = mongoose.model('Setting', new mongoose.Schema({}, { strict: false }));
  const settings = await Setting.findOne();
  console.log('=== categoryIconGroups (mac) ===');
  const macGrp = settings?.categoryIconGroups?.find(g => g.categoryKey === 'mac');
  console.log(macGrp ? JSON.stringify(macGrp.icons, null, 2) : 'NO MAC GRP');

  console.log('=== navbarMenuItems (Mac) ===');
  const macNav = settings?.navbarMenuItems?.find(i => (i.name || '').toLowerCase().includes('mac'));
  console.log(macNav ? JSON.stringify(macNav.dropdownItems, null, 2) : 'NO MAC NAV');

  process.exit(0);
}).catch(err => {
  console.error('DB ERROR:', err.message);
  process.exit(1);
});
