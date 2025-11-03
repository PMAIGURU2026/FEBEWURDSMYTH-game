/**
 * WURDSMYTH Word List with Multiple Difficulty Levels
 * Includes word definitions and example sentences for various game modes
 */

const vocabularyDatabase = {
  // LEVEL 1: EASY - Common everyday words
  easy: [
    {
      word: 'HAPPY',
      definition: 'Feeling or showing pleasure or contentment',
      sentence: 'She felt ____ when she received good news.',
      choices: ['HAPPY', 'ANGRY', 'TIRED', 'BORED']
    },
    {
      word: 'BRIGHT',
      definition: 'Giving out or reflecting much light',
      sentence: 'The ____ sun shone through the window.',
      choices: ['BRIGHT', 'DARK', 'COLD', 'QUIET']
    },
    {
      word: 'QUICK',
      definition: 'Moving fast or doing something in a short time',
      sentence: 'The rabbit was very ____ and ran away.',
      choices: ['QUICK', 'SLOW', 'LAZY', 'HEAVY']
    },
    {
      word: 'BRAVE',
      definition: 'Ready to face and endure danger or pain',
      sentence: 'The ____ firefighter rushed into the burning building.',
      choices: ['BRAVE', 'SCARED', 'WEAK', 'CRUEL']
    },
    {
      word: 'FRIEND',
      definition: 'A person with whom one has a bond of mutual affection',
      sentence: 'My best ____ and I have known each other for years.',
      choices: ['FRIEND', 'ENEMY', 'STRANGER', 'TEACHER']
    },
    {
      word: 'SMILE',
      definition: 'Form one\'s features into a pleased or amused expression',
      sentence: 'Her warm ____ made everyone feel welcome.',
      choices: ['SMILE', 'FROWN', 'LAUGH', 'CRY']
    },
    {
      word: 'PEACE',
      definition: 'Freedom from disturbance; tranquility',
      sentence: 'After the war ended, there was finally ____.',
      choices: ['PEACE', 'WAR', 'CHAOS', 'NOISE']
    },
    {
      word: 'DREAM',
      definition: 'A series of thoughts or images during sleep',
      sentence: 'Last night I had a strange ____ about flying.',
      choices: ['DREAM', 'REALITY', 'AWAKE', 'SLEEP']
    }
  ],

  // LEVEL 2: MEDIUM - Common academic words
  medium: [
    {
      word: 'ANALYZE',
      definition: 'Examine something in detail to understand it better',
      sentence: 'Scientists ____ data to draw meaningful conclusions.',
      choices: ['ANALYZE', 'IGNORE', 'DESTROY', 'CREATE']
    },
    {
      word: 'DIVERSE',
      definition: 'Showing a great deal of variety',
      sentence: 'The city has a ____ population from many cultures.',
      choices: ['DIVERSE', 'UNIFORM', 'BORING', 'SIMPLE']
    },
    {
      word: 'EVIDENT',
      definition: 'Plain or obvious; clearly seen or understood',
      sentence: 'It was ____ from her expression that she was upset.',
      choices: ['EVIDENT', 'HIDDEN', 'UNCLEAR', 'SECRET']
    },
    {
      word: 'JUSTIFY',
      definition: 'Show or prove to be right or reasonable',
      sentence: 'He tried to ____ his actions with logical arguments.',
      choices: ['JUSTIFY', 'CONDEMN', 'HIDE', 'FORGET']
    },
    {
      word: 'PERSIST',
      definition: 'Continue firmly despite difficulty or opposition',
      sentence: 'Despite many failures, she continued to ____ in her efforts.',
      choices: ['PERSIST', 'QUIT', 'SURRENDER', 'ABANDON']
    },
    {
      word: 'REQUIRE',
      definition: 'Need for a particular purpose',
      sentence: 'This job will ____ excellent communication skills.',
      choices: ['REQUIRE', 'REJECT', 'IGNORE', 'AVOID']
    },
    {
      word: 'SUSTAIN',
      definition: 'Strengthen or support physically or mentally',
      sentence: 'The organization works to ____ endangered species.',
      choices: ['SUSTAIN', 'DESTROY', 'HARM', 'NEGLECT']
    },
    {
      word: 'COMPLEX',
      definition: 'Consisting of many different and connected parts',
      sentence: 'The human brain is an incredibly ____ organ.',
      choices: ['COMPLEX', 'SIMPLE', 'BASIC', 'EASY']
    }
  ],

  // LEVEL 3: HARD - Advanced vocabulary (Barron's style)
  hard: [
    {
      word: 'ABYSMAL',
      definition: 'Extremely bad; appalling',
      sentence: 'The team\'s performance this season has been ____.',
      choices: ['ABYSMAL', 'EXCELLENT', 'AVERAGE', 'DECENT']
    },
    {
      word: 'ACUMEN',
      definition: 'The ability to make good judgments and quick decisions',
      sentence: 'Her business ____ helped the company succeed.',
      choices: ['ACUMEN', 'FAILURE', 'IGNORANCE', 'WEAKNESS']
    },
    {
      word: 'AFFABLE',
      definition: 'Friendly, good-natured, and easy to talk to',
      sentence: 'The ____ professor was beloved by all students.',
      choices: ['AFFABLE', 'HOSTILE', 'RUDE', 'STERN']
    },
    {
      word: 'ALLEVIATE',
      definition: 'Make pain, suffering, or problems less severe',
      sentence: 'The medicine helped to ____ her symptoms.',
      choices: ['ALLEVIATE', 'WORSEN', 'INCREASE', 'INTENSIFY']
    },
    {
      word: 'ASTUTE',
      definition: 'Having the ability to accurately assess situations',
      sentence: 'The ____ investor knew exactly when to buy stocks.',
      choices: ['ASTUTE', 'FOOLISH', 'NAIVE', 'CARELESS']
    },
    {
      word: 'BENEVOLENT',
      definition: 'Well-meaning and kindly',
      sentence: 'The ____ donor gave millions to charity.',
      choices: ['BENEVOLENT', 'CRUEL', 'SELFISH', 'MEAN']
    },
    {
      word: 'CANDID',
      definition: 'Truthful and straightforward; frank',
      sentence: 'I appreciate your ____ feedback on my work.',
      choices: ['CANDID', 'DISHONEST', 'EVASIVE', 'VAGUE']
    },
    {
      word: 'DILIGENT',
      definition: 'Having or showing care in one\'s work or duties',
      sentence: 'The ____ student studied every night for the exam.',
      choices: ['DILIGENT', 'LAZY', 'CARELESS', 'NEGLIGENT']
    },
    {
      word: 'ELOQUENT',
      definition: 'Fluent or persuasive in speaking or writing',
      sentence: 'The speaker gave an ____ address that moved the audience.',
      choices: ['ELOQUENT', 'INARTICULATE', 'BORING', 'UNCLEAR']
    },
    {
      word: 'EPHEMERAL',
      definition: 'Lasting for a very short time',
      sentence: 'Fame can be ____, disappearing as quickly as it came.',
      choices: ['EPHEMERAL', 'PERMANENT', 'ETERNAL', 'LASTING']
    },
    {
      word: 'FASTIDIOUS',
      definition: 'Very attentive to accuracy and detail',
      sentence: 'He was ____ about keeping his workspace organized.',
      choices: ['FASTIDIOUS', 'CARELESS', 'SLOPPY', 'MESSY']
    },
    {
      word: 'GREGARIOUS',
      definition: 'Fond of company; sociable',
      sentence: 'Her ____ nature made her popular at parties.',
      choices: ['GREGARIOUS', 'SHY', 'WITHDRAWN', 'ANTISOCIAL']
    },
    {
      word: 'METICULOUS',
      definition: 'Showing great attention to detail',
      sentence: 'The ____ researcher checked every fact twice.',
      choices: ['METICULOUS', 'CARELESS', 'HASTY', 'SLOPPY']
    },
    {
      word: 'NEFARIOUS',
      definition: 'Wicked or criminal',
      sentence: 'The villain hatched a ____ plan to steal the treasure.',
      choices: ['NEFARIOUS', 'NOBLE', 'VIRTUOUS', 'HONORABLE']
    },
    {
      word: 'PENSIVE',
      definition: 'Engaged in deep or serious thought',
      sentence: 'She sat in a ____ mood, contemplating her future.',
      choices: ['PENSIVE', 'CAREFREE', 'THOUGHTLESS', 'FRIVOLOUS']
    },
    {
      word: 'PRAGMATIC',
      definition: 'Dealing with things sensibly and realistically',
      sentence: 'His ____ approach focused on practical solutions.',
      choices: ['PRAGMATIC', 'IDEALISTIC', 'IMPRACTICAL', 'THEORETICAL']
    },
    {
      word: 'RESILIENT',
      definition: 'Able to recover quickly from difficulties',
      sentence: 'The ____ community rebuilt after the disaster.',
      choices: ['RESILIENT', 'FRAGILE', 'WEAK', 'BRITTLE']
    },
    {
      word: 'TENACIOUS',
      definition: 'Not readily letting go of or giving up',
      sentence: 'Her ____ spirit helped her overcome many obstacles.',
      choices: ['TENACIOUS', 'WEAK', 'YIELDING', 'TIMID']
    },
    {
      word: 'UBIQUITOUS',
      definition: 'Present, appearing, or found everywhere',
      sentence: 'Smartphones have become ____ in modern society.',
      choices: ['UBIQUITOUS', 'RARE', 'SCARCE', 'ABSENT']
    },
    {
      word: 'ZEALOUS',
      definition: 'Having or showing great energy or enthusiasm',
      sentence: 'She was a ____ advocate for environmental protection.',
      choices: ['ZEALOUS', 'APATHETIC', 'INDIFFERENT', 'LAZY']
    }
  ],

  // LEVEL 4: EXPERT - Very advanced vocabulary
  expert: [
    {
      word: 'OBFUSCATE',
      definition: 'Render obscure, unclear, or unintelligible',
      sentence: 'The politician tried to ____ the truth with complex jargon.',
      choices: ['OBFUSCATE', 'CLARIFY', 'EXPLAIN', 'ILLUMINATE']
    },
    {
      word: 'PERSPICACIOUS',
      definition: 'Having a ready insight into and understanding of things',
      sentence: 'The ____ detective solved the mystery quickly.',
      choices: ['PERSPICACIOUS', 'OBLIVIOUS', 'IGNORANT', 'CONFUSED']
    },
    {
      word: 'RECALCITRANT',
      definition: 'Having an obstinately uncooperative attitude',
      sentence: 'The ____ witness refused to testify in court.',
      choices: ['RECALCITRANT', 'COOPERATIVE', 'OBEDIENT', 'COMPLIANT']
    },
    {
      word: 'SANGUINE',
      definition: 'Optimistic or positive, especially in difficult situations',
      sentence: 'Despite setbacks, she remained ____ about the project.',
      choices: ['SANGUINE', 'PESSIMISTIC', 'GLOOMY', 'NEGATIVE']
    },
    {
      word: 'TACITURN',
      definition: 'Reserved or uncommunicative in speech; saying little',
      sentence: 'The ____ hermit rarely spoke to visitors.',
      choices: ['TACITURN', 'TALKATIVE', 'VERBOSE', 'CHATTY']
    },
    {
      word: 'VICARIOUS',
      definition: 'Experienced in the imagination through another person',
      sentence: 'She got ____ pleasure from reading adventure novels.',
      choices: ['VICARIOUS', 'DIRECT', 'PERSONAL', 'FIRSTHAND']
    }
  ]
};

/**
 * Get all words as a flat array
 */
function getAllWords() {
  const allWords = [];
  Object.values(vocabularyDatabase).forEach(level => {
    level.forEach(item => allWords.push(item.word));
  });
  return allWords;
}

/**
 * Get words by difficulty level
 */
function getWordsByLevel(level) {
  return vocabularyDatabase[level] || [];
}

/**
 * Get a random word from a specific level
 */
function getRandomWordByLevel(level) {
  const words = vocabularyDatabase[level];
  if (!words || words.length === 0) return null;
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Get a random word from any level
 */
function getRandomWord() {
  const levels = Object.keys(vocabularyDatabase);
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];
  return getRandomWordByLevel(randomLevel);
}

/**
 * Check if a word exists in the database
 */
function isValidWord(word) {
  const upperWord = word.toUpperCase();
  for (const level of Object.values(vocabularyDatabase)) {
    if (level.some(item => item.word === upperWord)) {
      return true;
    }
  }
  return false;
}

/**
 * Get word details including definition and sentence
 */
function getWordDetails(word) {
  const upperWord = word.toUpperCase();
  for (const level of Object.values(vocabularyDatabase)) {
    const found = level.find(item => item.word === upperWord);
    if (found) return found;
  }
  return null;
}

/**
 * Get difficulty level of a word
 */
function getWordDifficulty(word) {
  const upperWord = word.toUpperCase();
  for (const [level, words] of Object.entries(vocabularyDatabase)) {
    if (words.some(item => item.word === upperWord)) {
      return level;
    }
  }
  return null;
}

module.exports = {
  vocabularyDatabase,
  getAllWords,
  getWordsByLevel,
  getRandomWordByLevel,
  getRandomWord,
  isValidWord,
  getWordDetails,
  getWordDifficulty
};
