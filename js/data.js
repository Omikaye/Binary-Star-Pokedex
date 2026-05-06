// ...existing code...

// Helper function to build trainer sprite background CSS from URL
const buildTrainerSpriteBackgroundFromUrl = (url, includeSize = true) => {
  // Note: URLs from archives.bulbagarden.net are case-sensitive and should be used as-is.
  // Use explicit positioning so thumbnails crop consistently.
  const base = `background:transparent url(${url}) no-repeat scroll right 0 top 0`;
  return includeSize ? `${base}; background-size:512px 256px;` : base;
};

window.getTrainerIcon = (trainerClassOrName, checkPersonalName) => {
  if (!trainerClassOrName) return 'background:transparent';

  // If a trainer object was passed in, use its fields directly.
  // This avoids relying on parsing display name text.
  let personalName = '';
  let trainerClass = '';
  if (typeof trainerClassOrName === 'object') {
    personalName = trainerClassOrName.personalName || '';
    trainerClass = trainerClassOrName.trainerClass || '';
    trainerClassOrName = trainerClassOrName.name || '';
  }

  let classId = toID(trainerClassOrName);

  if (checkPersonalName) {
    // Prefer explicit personalName / trainerClass fields when available.
    const personalNameId = toID(personalName);
    if (personalNameId && TrainerSpriteLinks[personalNameId]) {
      return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[personalNameId]);
    }
    const trainerClassId = toID(trainerClass);
    if (trainerClassId && TrainerSpriteLinks[trainerClassId]) {
      return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[trainerClassId]);
    }

    // Fallback to parsing the last word as a personal name.
    const parts = String(trainerClassOrName).trim().split(/\s+/);
    if (parts.length >= 2) {
      const lastWordId = toID(parts[parts.length - 1]);
      if (TrainerSpriteLinks[lastWordId]) {
        return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[lastWordId]);
      }
      const className = window.getTrainerClass(trainerClassOrName);
      classId = toID(className);
    }
  }

  if (TrainerSpriteLinks[classId]) {
    return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[classId]);
  }

  return 'background:transparent';
};

// Returns only the background image/position for use in compact thumbnails
window.getTrainerBackground = (trainerClassOrName, checkPersonalName) => {
  if (!trainerClassOrName) return 'background:transparent';

  // If a trainer object was passed in, use its fields directly.
  let personalName = '';
  let trainerClass = '';
  if (typeof trainerClassOrName === 'object') {
    personalName = trainerClassOrName.personalName || '';
    trainerClass = trainerClassOrName.trainerClass || '';
    trainerClassOrName = trainerClassOrName.name || '';
  }

  let classId = toID(trainerClassOrName);

  if (checkPersonalName) {
    const personalNameId = toID(personalName);
    if (personalNameId && TrainerSpriteLinks[personalNameId]) {
      return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[personalNameId], false);
    }
    const trainerClassId = toID(trainerClass);
    if (trainerClassId && TrainerSpriteLinks[trainerClassId]) {
      return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[trainerClassId], false);
    }

    const parts = String(trainerClassOrName).trim().split(/\s+/);
    if (parts.length >= 2) {
      const lastWordId = toID(parts[parts.length - 1]);
      if (TrainerSpriteLinks[lastWordId]) {
        return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[lastWordId], false);
      }
      const className = window.getTrainerClass(trainerClassOrName);
      classId = toID(className);
    }
  }

  if (TrainerSpriteLinks[classId]) {
    return buildTrainerSpriteBackgroundFromUrl(TrainerSpriteLinks[classId], false);
  }

  return 'background:transparent';
};
