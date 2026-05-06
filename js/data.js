// ...existing code...

// Resolve a trainer sprite link entry to a URL.
// Supports legacy format (string) and new format ({ unique, class }).
const resolveTrainerSpriteUrl = (entry) => {
  if (!entry) return null;
  if (typeof entry === 'string') return entry;
  if (typeof entry === 'object') {
    // Prefer per-person sprite when present, else class sprite
    return entry.unique || entry.class || null;
  }
  return null;
};

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
      const url = resolveTrainerSpriteUrl(TrainerSpriteLinks[personalNameId]);
      if (url) return buildTrainerSpriteBackgroundFromUrl(url);
    }
    const trainerClassId = toID(trainerClass);
    if (trainerClassId && TrainerSpriteLinks[trainerClassId]) {
      const url = resolveTrainerSpriteUrl(TrainerSpriteLinks[trainerClassId]);
      if (url) return buildTrainerSpriteBackgroundFromUrl(url);
    }

    // Fallback to parsing the last word as a personal name.
    const parts = String(trainerClassOrName).trim().split(/\s+/);
    if (parts.length >= 2) {
      const lastWordId = toID(parts[parts.length - 1]);
      if (TrainerSpriteLinks[lastWordId]) {
        const url = resolveTrainerSpriteUrl(TrainerSpriteLinks[lastWordId]);
        if (url) return buildTrainerSpriteBackgroundFromUrl(url);
      }
      const className = window.getTrainerClass(trainerClassOrName);
      classId = toID(className);
    }
  }

  if (TrainerSpriteLinks[classId]) {
    const url = resolveTrainerSpriteUrl(TrainerSpriteLinks[classId]);
    if (url) return buildTrainerSpriteBackgroundFromUrl(url);
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
      const url = resolveTrainerSpriteUrl(TrainerSpriteLinks[personalNameId]);
      if (url) return buildTrainerSpriteBackgroundFromUrl(url, false);
    }
    const trainerClassId = toID(trainerClass);
    if (trainerClassId && TrainerSpriteLinks[trainerClassId]) {
      const url = resolveTrainerSpriteUrl(TrainerSpriteLinks[trainerClassId]);
      if (url) return buildTrainerSpriteBackgroundFromUrl(url, false);
    }

    const parts = String(trainerClassOrName).trim().split(/\s+/);
    if (parts.length >= 2) {
      const lastWordId = toID(parts[parts.length - 1]);
      if (TrainerSpriteLinks[lastWordId]) {
        const url = resolveTrainerSpriteUrl(TrainerSpriteLinks[lastWordId]);
        if (url) return buildTrainerSpriteBackgroundFromUrl(url, false);
      }
      const className = window.getTrainerClass(trainerClassOrName);
      classId = toID(className);
    }
  }

  if (TrainerSpriteLinks[classId]) {
    const url = resolveTrainerSpriteUrl(TrainerSpriteLinks[classId]);
    if (url) return buildTrainerSpriteBackgroundFromUrl(url, false);
  }

  return 'background:transparent';
};
