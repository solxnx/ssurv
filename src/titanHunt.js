export const titans = new Map ([
    ['Aruanak', {
        skills: ['Arachnid Frenzy', 'Fangs of Doom', 'Frenzied Bites', 'Huntress Snare', 'Potent Toxin', 'Spider Senses', 'Ultimate Assassin', 'Web of Confusion'],
    }],
    ['BroKenth', {
        skills: ['Combat Expertise', 'Emperors Blessing', 'Gladiatorial Instincts', 'Purifying Sands', 'Sandscale Wrath', 'Savagery', 'Seasoned Gladiator', 'Unstoppable Force'],
    }],
    ['Kobolds', {
        skills: ['Chaos Stabilizer', 'Demolition Expert', 'Excavators Strength', 'Hasty Reload', 'Kobold Fortitude', 'Rust Corrosion', 'Static Storm', 'Tinkers Elegance'],
    }],
    ['Mhyzahet', {
        skills: ['Blood Parasites', 'Crushing Pincer', 'Heart of Sand', 'Queens Stinger', 'Sandstorm', 'Sandwalker', 'Scorpid Carapace', 'Violent Toxins'],
    }],
    ['Midorahk', {
        skills: ['Golden Tremor', 'Goldrush', 'Radiant Cracks', 'Searing Ash', 'Skittering Perception', 'Spiked Carapace', 'Sunpiercer', 'Toxic Proliferation'],
    }],
    ['Fellipox', {
        skills: ['Distance Decay', 'Exposed Spores', 'Fungal Frenzy', 'Fungal Impact', 'Ironshroom', 'Maddening Mold', 'Psychedelic Precision', 'Putrid Strength'],
    }],
]);

export const titanSkills = new Map ([
    ['Arachnid Frenzy', {text: 'Crit chance, MS'}],
    ['Fangs of Doom', {debuffs: ['Doom'], condition: 'Doom'}],
    ['Frenzied Bites', {buffs: ['Haste']}],
    ['Huntress Snare', {debuffs: ['Slow'], condition: 'Aptitude'}],
    ['Potent Toxin', {debuffs: ['Dazed'], condition: 'Poison'}],
    ['Spider Senses', {text: 'Multicast', condition: 'Thrust'}],
    ['Ultimate Assassin', {text: ['Cast freq'], condition: 'Ambush'}],
    ['Web of Confusion', {debuffs: ['Disoriented'], condition: 'Disarray'}],

    ['Combat Expertise', {buffs: ['Prowess'], condition: 'Prowess'}],
    ['Emperors Blessing', {buffs: ['Purity'], condition: 'Purity'}],
    ['Gladiatorial Instincts', {text: 'Dmg, Cast freq'}],
    ['Purifying Sands', {buffs: ['Purity'], condition: 'Resilience'}],
    ['Sandscale Wrath', {text: 'Burn explosion', condition: 'Burn'}],
    ['Savagery', {traits: ['Brutal'], condition: 'Brutal'}],
    ['Seasoned Gladiator', {text: 'Crit dmg nearby'}],
    ['Unstoppable Force', {debuffs: ['Shattered']}],

    ['Chaos Stabilizer', {buffs: ['Purity'], condition: 'Chaotic'}],
    ['Demolition Expert', {traits: ['Devastating'], condition: 'Devastating'}],
    ['Excavators Strength', {buffs: ['Prowess'], condition: "Shattered"}],
    ['Hasty Reload', {buffs: ['Ammunition'], condition: 'Ammunition'}],
    ['Kobold Fortitude', {text: 'Heath, Area'}],
    ['Rust Corrosion', {debuffs: ['Brittle'], condition: 'Slow'}],
    ['Static Storm', {buffs: ['Electrified']}],
    ['Tinkers Elegance', {buffs: ['Finesse'], condition: 'Radiance'}],

    ['Blood Parasites', {text: 'Bleed dmg', condition: 'Bleed'}],
    ['Crushing Pincer', {debuffs: ['Exposed']}],
    ['Heart of Sand', {traits: ['Artifact'], condition: 'Artifact'}],
    ['Queens Stinger', {debuffs: ['Fragility'], condition: 'Weakness'}],
    ['Sandstorm', {debuffs: ['Dazed'], condition: 'Colossal'}],
    ['Sandwalker', {buffs: ['Form']}],
    ['Scorpid Carapace', {text: 'Armor, Block'}],
    ['Violent Toxins', {text: 'Poison tick rate', condition: 'Poison'}],

    ['Golden Tremor', {buffs: ['Colossal'], condition: 'Brittle'}],
    ['Goldrush', {text: 'Crit dmg, Cast freq'}],
    ['Radiant Cracks', {buffs: ['Radiance'], condition: 'Exposed'}],
    ['Searing Ash', {text: 'Crit per burn stacks', condition: 'Burn'}],
    ['Skittering Perception', {buffs: ['Aptitude']}],
    ['Spiked Carapace', {buffs: ['Resilience'], condition: 'Resilience'}],
    ['Sunpiercer', {traits: ['Piercing'], condition: 'Piercing'}],
    ['Toxic Proliferation', {text: 'Poison spread', condition: 'Poison'}],

    ['Putrid Strength', {text: 'Health, dmg'}],
    ['Distance Decay', {text: 'Crit chance'}],
    ['Exposed Spores', {debuffs: ['Exposed'], condition: 'Bleed'}],
    ['Psychedelic Precision', {buffs: ['Aptitude'], condition: 'Aptitude'}],
    ['Fungal Impact', {traits: ['Impactful'], condition: 'Impactful'}],
    ['Ironshroom', {text: 'Dmg per Bulwark', condition: 'Bulwark'}],
    ['Fungal Frenzy', {text: 'Cast freq w/ Nature', condition: 'Nature'}],
    ['Maddening Mold', {text: 'More Chaotic triggers', condition: 'Chaotic'}],
]);