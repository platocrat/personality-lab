import { definitelyCenteredStyle } from "@/theme/styles"

export const GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF = `/gender-and-creativity-us/assessment`

export const GENDER_AND_CREATIVITY_US_FORM_IDS = [
  'consent-info',
  'spend-time-with-others',
  'level-of-agreement',
  'literature',
  'music',
  'arts-and-crafts',
  'creative-cooking',
  'sports',
  'visual-arts',
  'performing-arts',
  'science-and-engineering',
  'five-most-creative-achievements',
  'task-enjoyment',
]

export const GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACES = (
  fragmentName: string
): string => {
  const MAIN = 'gender-and-creativity-us'
  const CREATIVITY_AND_ACHIEVEMENTS = 'creativity-and-achievements'

  switch (fragmentName) {
    case 'main':
      return MAIN
    case 'spend-time-with-others':
    case 'level-of-agreement':
    case 'creativity-and-achievements':
    case 'five-most-creative-achievements':
    case 'task-enjoyment':
      return `${MAIN}--${fragmentName}`
    case 'literature':
    case 'music':
    case 'arts-and-crafts':
    case 'creative-cooking':
    case 'sports':
    case 'visual-arts':
    case 'performing-arts':
    case 'science-and-engineering':
      return `${MAIN}--${CREATIVITY_AND_ACHIEVEMENTS}--${fragmentName}`
    default:
      return ''
  }
}


export const radioOrCheckboxInputStyle = (
  isVertical: boolean,
  fontSize: string,
) => ({
  questionBodyStyle: {
    ...definitelyCenteredStyle,
  },
  radioButtonLabelStyle: {
    width: '100%',
    paddingRight: '12px',
    margin: isVertical ? '12px 0px' : ''
  },
  radioButtonInputStyle: {
    marginRight: '12px',
    top: `0px`,
    left: `2px`,
    height: `24.5px`,
    width: `14.5px`,
  },
  radioButtonText: {
    fontSize: fontSize,
  }
})


const levelOfAgreementOptions = [
  `Strongly Disagree`,
  `Disagree`,
  `Neutral`,
  `Agree`,
  `Strongly Agree`,
]
const creativityAndAchievementsOptions = [
  `Never`,
  `1-2 Times`,
  `3-5 Times`,
  `6-10 Times`,
  `More than 10 times`
]


export const GENDER_AND_CREATIVITY_US_ACTIVITY_BANK_LEGEND = {
  spendTimeWithOthers: levelOfAgreementOptions,
  levelOfAgreement: levelOfAgreementOptions,
  literature: creativityAndAchievementsOptions,
  music: creativityAndAchievementsOptions,
  artsAndCrafts: creativityAndAchievementsOptions,
  creativeCooking: creativityAndAchievementsOptions,
  visualArts: creativityAndAchievementsOptions,
  performingArts: creativityAndAchievementsOptions,
}


export const GENDER_AND_CREATIVITY_US_ACTIVITY_BANK = {
  spendTimeWithOthers: [
    `Is outgoing, sociable`,
    // `Is compassionate, has a soft heart`,
    // `Tends to be disorganized`,
    // `Is relaxed, handles stress well`,
    // `Has few artistic interests`,
    // `Has an assertive personality`,
    // `Is respectful, treats others with respect`,
    // `Tends to be lazy`,
    // `Stays optimistic after experiencing a setback`,
    // `Is curious about many different things`,
    // `Rarely feels excited or eager`,
    // `Tends to find fault with others`,
    // `Is dependable, steady`,
    // `Is moody, has up and down mood swings`,
    // `Is inventive, finds clever ways to do things`,
    // `Tends to be quiet`,
    // `Feels little sympathy for others`,
    // `Is systematic, likes to keep things in order`,
    // `Can be tense`,
    // `Is fascinated by art, music, or literature`,
    // `Is dominant, acts as a leader`,
    // `Starts arguments with others`,
    // `Has difficulty getting started on tasks`,
    // `Feels secure, comfortable with self`,
    // `Avoids intellectual, philosophical discussions`,
    // `Is less active than other people`,
    // `Has a forgiving nature`,
    // `Can be somewhat careless`,
    // `Is emotionally stable, not easily upset`,
    // `Has little creativity`,
    // `Please, select 'neutral' for this option`,
    // `Is sometimes shy, introverted`,
    // `Is helpful and unselfish with others`,
    // `Keeps things neat and tidy`,
    // `Worries a lot`,
    // `Values art and beauty`,
    // `Finds it hard to influence people`,
    // `Is sometimes rude to others`,
    // `Is efficient, gets things done`,
    // `Often feels sad`,
    // `Is complex, a deep thinker`,
    // `Is full of energy`,
    // `Is suspicious of others' intentions`,
    // `Is reliable, can always be counted on`,
    // `Keeps their emotions under control`,
    // `Has difficulty imagining things`,
    // `Is talkative`,
    // `Can be cold and uncaring`,
    // `Leaves a mess, doesn't clean up`,
    // `Rarely feels anxious or afraid`,
    // `Thinks poetry and plays are boring`,
    // `Prefers to have others take charge`,
    // `Is polite, courteous to others`,
    // `Is persistent, works until the task is finished`,
    // `Tends to feel depressed, blue`,
    // `Has little interest in abstract ideas`,
    // `Shows a lot of enthusiasm`,
    // `Assumes the best about people`,
    // `Sometimes behaves irresponsibly`,
    // `Is temperamental, gets emotional easily`,
    // `Is original, comes up with new ideas`
  ],
  levelOfAgreement: [
    `It's not wise to tell your secrets`,
    // `I like to use clever manipulation to get my way`,
    // `Whatever it takes, you must get the important people on your side`,
    // `Avoid direct conflict with others because they may be useful in the future`,
    // `It's wise to keep track of information that you can use against people later`,
    // `You should wait for the right time to get back at people`,
    // `There are things you should hide from other people to preserve your reputation`,
    // `Make sure your plans benefit yourself, not others`,
    // `Most people can be manipulated`,
    // `People see me as a natural leader`,
    // `I hate being the center of attention`,
    // `Many group activities tend to be dull without me`,
    // `Please, select 'agree' for this option`,
    // `I know that I am special because everyone keeps telling me so`,
    // `I like to get acquainted with important people`,
    // `I feel embarrassed if someone compliments me`,
    // `I have been compared to famous people`,
    // `I am an average person`,
    // `I insist on getting the respect I deserve`,
    // `I like to get revenge on authorities`,
    // `I avoid dangerous situations`,
    // `Payback needs to be quick and nasty`,
    // `People often say I'm out of control`,
    // `It's true that I can be mean to others`,
    // `People who mess with me always regret it`,
    // `I have never gotten into trouble with the law`,
    // `I enjoy having sex with people I hardly know`,
    // `I'll say anything to get what I want`
  ],
  literature: [
    `Wrote a short literary work (e.g. poem, short story)`,
    `Wrote a long literary work (e.g. book, theatre play)`,
    `Wrote a newspaper article/editorial`,
    `Created an original talk`,
    `Made up a joke`,
    `Wrote a blog entry`
  ],
  music: [
    "Wrote a piece of music",
    "Reinterpreted a piece of music in a creative way",
    "Made up a melody",
    "Made up a rhythm",
    "Artificially created sounds (e.g. via computer or synthesizer)",
    "Created a mix-tape (or any other compilation of songs; e.g. DJ-ing)"
  ],
  artsAndCrafts: [
    `Wrote a short literary work (e.g. poem, short story)`,
    `Wrote a long literary work (e.g. book, theatre play)`,
    `Wrote a newspaper article/editorial`,
    `Created an original talk`,
    `Made up a joke`,
    `Wrote a blog entry`
  ],
  creativeCooking: [
    `Wrote a short literary work (e.g. poem, short story)`,
    `Wrote a long literary work (e.g. book, theatre play)`,
    `Wrote a newspaper article/editorial`,
    `Created an original talk`,
    `Made up a joke`,
    `Wrote a blog entry`
  ],
  visualArts: [
    `Wrote a short literary work (e.g. poem, short story)`,
    `Wrote a long literary work (e.g. book, theatre play)`,
    `Wrote a newspaper article/editorial`,
    `Created an original talk`,
    `Made up a joke`,
    `Wrote a blog entry`
  ],
  performingArts: [
    `Wrote a short literary work (e.g. poem, short story)`,
    `Wrote a long literary work (e.g. book, theatre play)`,
    `Wrote a newspaper article/editorial`,
    `Created an original talk`,
    `Made up a joke`,
    `Wrote a blog entry`
  ],
  engagementLevels: [
    `I have never been engaged in this domain`,
    `I have tried this domain once`,
    `I have already created at least one original work in this domain`,
    `I have presented my original work in this domain to some friends`,
    `I have presented my original work in this domain to strangers`,
    `I have already taken classes to improve my skills in this domain`,
    `I have already published my original work in this domain`,
    `I have already participated in a contest in this domain`,
    `I have already won an award or prize for my original work in this domain`,
    `Media have already reported about my work in this domain`,
    `I have already sold some of my work in this domain`
  ],
  taskEnjoyment: [
    `Build kitchen cabinets`,
    `Repair household appliances`,
    `Assemble electronic parts`,
    `Drive a truck to deliver packages to offices and homes`,
    `Test the quality of parts before shipment`,
    `Develop a new medicine`,
    `Study ways to reduce water pollution`,
    `Conduct chemical experiments`,
    `Examine blood samples using a microscope`,
    `Develop a way to better predict the weather`,
    `Write books or plays`,
    `Compose or arrange music`,
    `Create special effects for movies`,
    `Paint sets for plays`,
    `Write scripts for movies or television shows`,
    `Help people with personal or emotional problems`,
    `Give career guidance to people`,
    `Perform rehabilitation therapy`,
    `Do volunteer work at a non-profit organization`,
    `Teach a high school class`,
    `Manage a department within a large company`,
    `Start your own business`,
    `Negotiate business contracts`,
    `Market a new line of clothing`,
    `Sell merchandise at a department store`,
    `Install software across computers on a large network`,
    `Operate a calculator`,
    `Keep shipping and receiving records`,
    `Inventory supplies using a hand held computer`,
    `Stamp, sort, and distribute mail for an organization`,
    `Please select 'Dislike' for this response`,
    `Please select 'Strongly like' for this response`
  ],
}