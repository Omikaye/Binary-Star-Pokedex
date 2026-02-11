# UI Examples - Location Display

This document provides visual examples of how the new features will appear in the UI.

## Location Search Page

```
┌─────────────────────────────────────────────────────────────┐
│ Locations                                                    │
├─────────────────────────────────────────────────────────────┤
│ 1  Route 1                                                   │
│    This Rattata is guaranteed to be your first catchable    │
│    encounter here. If you are Nuzlocking, I highly          │
│    recommend either skipping this Rattata...                │
├─────────────────────────────────────────────────────────────┤
│ 2  Iki Town                                                  │
│    [Boss] Postgame: Kahuna Hala rematch                     │
├─────────────────────────────────────────────────────────────┤
│ 3  Hau'oli City                                              │
│    Main city on Melemele Island with shops and facilities   │
└─────────────────────────────────────────────────────────────┘
```

**Note:** Location notes appear under the location name in a gray box.

## Location Detail Page - Battles Section

```
┌─────────────────────────────────────────────────────────────┐
│ Route 1                                                      │
│ This Rattata is guaranteed to be your first catchable...    │
├─────────────────────────────────────────────────────────────┤
│ Battles                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Static] Static Encounter S154                          │ │
│ │          Alolan Rattata Tutorial                        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Visual Elements:**
- `[Static]` - Red badge with light red background
- `Static Encounter S154` - Bold black text, clickable link
- `Alolan Rattata Tutorial` - Gray lighter text

## Location Detail Page - Multiple Battles

```
┌─────────────────────────────────────────────────────────────┐
│ Hau'oli City                                                 │
│ Main city on Melemele Island with shops and facilities      │
├─────────────────────────────────────────────────────────────┤
│ Battles                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Story] Trainer Hau                                     │ │
│ │         Hau battle 1 - Rowlet Chosen                    │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [Story] Trainer Hau                                     │ │
│ │         Hau battle 2 - Litten Chosen                    │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [Boss] Kahuna Hala                                      │ │
│ │        Grand Trial                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Battle Tag Colors:**
- `[Story]` - Green badge (#4CAF50 text, #E8F5E9 background)
- `[Boss]` - Purple badge (#9C27B0 text, #F3E5F5 background)
- `[Optional]` - Blue badge
- `[Static]` - Red badge
- `[Legendary]` - Gold badge
- `[Trial]` - Cyan badge
- `[Totem]` - Pink badge
- `[Rematch]` - Orange badge

**Hover Behavior:**
- Hovering over a tag shows a tooltip with the tag description
- Example: Hovering over `[Story]` shows "Required story battle that must be completed to progress through the main storyline"

## Location Detail Page - Shop Tables

```
┌─────────────────────────────────────────────────────────────┐
│ Pokémart Basic                                               │
│ ┌──────┬──────────────────────┬───────────────────────────┐ │
│ │ Icon │ Item                 │ Price                     │ │
│ ├──────┼──────────────────────┼───────────────────────────┤ │
│ │ [⚪] │ Poké Ball            │ $200                      │ │
│ │ [🧪] │ Potion               │ $200                      │ │
│ │ [💊] │ Antidote             │ $200                      │ │
│ │ [⚡] │ Paralyze Heal        │ $200                      │ │
│ │ [😴] │ Awakening            │ $100                      │ │
│ └──────┴──────────────────────┴───────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Shop Display Features:**
- Shop table name as section heading
- Item icons displayed (actual sprite icons, not emoji)
- Item names are clickable links to item detail pages
- Prices aligned to center

## Location Detail Page - Multiple Shop Tables

```
┌─────────────────────────────────────────────────────────────┐
│ Pokémart Basic                                               │
│ [Table with Poké Balls, Potions, etc.]                      │
├─────────────────────────────────────────────────────────────┤
│ Boutique Hau'oli                                             │
│ [Table with Silk Scarf, Muscle Band, etc.]                  │
└─────────────────────────────────────────────────────────────┘
```

**Note:** Each shop table appears in its own yellow-tinted section.

## Interactive Elements

### Clickable Links
- **Battle entries** → Link to trainer or static encounter detail page
- **Item names** → Link to item detail page
- **Shop items** → Link to item or move detail page (for TMs)

### Hover Tooltips
- **Battle tags** → Show tag description
- **Item icons** → Show item name

### Visual Hierarchy
1. **Section headings** (h3) - Larger, bold, colored
2. **Battle tags** - Small, colored badges
3. **Battle names** - Normal size, bold, black
4. **Battle notes** - Smaller size, lighter gray
5. **Table headers** - Bold with bottom border
6. **Table rows** - Alternating backgrounds for readability

## Color Scheme

### Sections
- **Encounters** - Green tint (#e8f5e9)
- **Static Pokémon** - Pink tint (#fce4ec)
- **Trainers** - Blue tint (#e3f2fd)
- **Battles** - Gray tint (#f5f5f5)
- **Shops** - Yellow tint (#fffde7)
- **Items** - Orange tint (#fff3e0)

### Battle Tags (Badge Style)
All tags have:
- Rounded corners (border-radius: 12px)
- Padding: 2px 8px
- Small font size (0.75em)
- Bold font weight
- Custom color + background color per tag

## Accessibility

- All colors have sufficient contrast ratios
- Hover states clearly visible
- Tooltips provide additional context
- Semantic HTML structure
- Keyboard navigation supported

## Responsive Behavior

- Tables stack on narrow screens
- Icons scale proportionally
- Text wraps appropriately
- Touch-friendly click targets

---

**Note:** The actual UI uses the Pokémon Showdown sprite icons and color scheme. These examples show the structure and layout.
