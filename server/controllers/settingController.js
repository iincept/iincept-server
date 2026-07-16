const Setting = require("../models/Setting");

// Get site settings (Public)
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default settings if not exists
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update site settings (Admin only)
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting({});
    }

    const {
      logo,
      businessEmail,
      businessPhone,
      supportHours,
      socialLinks,
      heroTitle1,
      heroSubtitle1,
      heroButtonText1,
      heroTitle2,
      heroSubtitle2,
      heroButtonText2,
      featuredProductIds,
      shippingCharge,
      taxPercentage,
      freeShippingThreshold,
      announcement,
    } = req.body;

    if (logo !== undefined) settings.logo = logo;
    if (businessEmail !== undefined) settings.businessEmail = businessEmail;
    if (businessPhone !== undefined) settings.businessPhone = businessPhone;
    if (supportHours !== undefined) settings.supportHours = supportHours;
    if (socialLinks !== undefined) settings.socialLinks = socialLinks;

    if (heroTitle1 !== undefined) settings.heroTitle1 = heroTitle1;
    if (heroSubtitle1 !== undefined) settings.heroSubtitle1 = heroSubtitle1;
    if (heroButtonText1 !== undefined) settings.heroButtonText1 = heroButtonText1;

    if (heroTitle2 !== undefined) settings.heroTitle2 = heroTitle2;
    if (heroSubtitle2 !== undefined) settings.heroSubtitle2 = heroSubtitle2;
    if (heroButtonText2 !== undefined) settings.heroButtonText2 = heroButtonText2;

    if (featuredProductIds !== undefined) settings.featuredProductIds = featuredProductIds;
    if (shippingCharge !== undefined) settings.shippingCharge = Number(shippingCharge);
    if (taxPercentage !== undefined) settings.taxPercentage = Number(taxPercentage);
    if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(freeShippingThreshold);
    if (announcement !== undefined) settings.announcement = announcement;

    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
