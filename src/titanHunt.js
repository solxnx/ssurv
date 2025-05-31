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
]);

export const titanSkills = new Map ([
    ['Arachnid Frenzy', {text: 'Crit chance, MS'}],
    ['Fangs of Doom', {debuffs: ['Doom'], condition: 'Doom'}],
    ['Frenzied Bites', {buffs: ['Haste']}],
    ['Huntress Snare', {debuffs: ['Slow'], condition: 'Aptitude'}],
    ['Potent Toxin', {debuffs: ['Dazed'], condition: '2x Poison'}],
    ['Spider Senses', {text: 'Multicast', condition: 'Thrust'}],
    ['Ultimate Assassin', {text: ['Cast freq'], condition: 'Ambush'}],
    ['Web of Confusion', {debuffs: ['Disoriented'], condition: '2x Disarray'}],

    ['Combat Expertise', {buffs: ['Prowess'], condition: 'Prowess'}],
    ['Emperors Blessing', {buffs: ['Purity'], condition: 'Purity'}],
    ['Gladiatorial Instincts', {text: 'Dmg, Cast freq'}],
    ['Purifying Sands', {buffs: ['Purity'], condition: '2x Resilience'}],
    ['Sandscale Wrath', {text: 'Burn explosion', condition: 'Burn'}],
    ['Savagery', {traits: ['Brutal'], condition: 'Brutal'}],
    ['Seasoned Gladiator', {text: 'Crit dmg nearby'}],
    ['Unstoppable Force', {debuffs: ['Shattered']}],

    ['Chaos Stabilizer', {buffs: ['Purity'], condition: 'Chaotic'}],
    ['Demolition Expert', {traits: ['Devastating'], condition: 'Devastating skill/rune'}],
    ['Excavators Strength', {buffs: ['Prowess'], condition: "2x Shattered"}],
    ['Hasty Reload', {buffs: ['Ammunition'], condition: 'Ammunition'}],
    ['Kobold Fortitude', {text: 'Heath, area'}],
    ['Rust Corrosion', {debuffs: ['Brittle'], condition: '2x Slow'}],
    ['Static Storm', {buffs: ['Electrified']}],
    ['Tinkers Elegance', {buffs: ['Finesse'], condition: 'Radiance'}],

    ['Blood Parasites', {text: 'Bleed dmg', condition: 'Bleed'}],
    ['Crushing Pincer', {debuffs: ['Exposed']}],
    ['Heart of Sand', {traits: ['Artifact'], condition: 'Artifact'}],
    ['Queens Stinger', {debuffs: ['Fragility'], condition: 'Weakness'}],
    ['Sandstorm', {debuffs: ['Brittle'], condition: 'Colossal'}],
    ['Sandwalker', {buffs: ['Form']}],
    ['Scorpid Carapace', {text: 'Armor, Block'}],
    ['Violent Toxins', {text: 'Poison tick rate', condition: '3x Poison'}],
]);