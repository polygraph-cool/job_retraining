import loadIntro from './truckerDevIntro';
import loadScatterplot from './scatterplotUpdated';
import loadDevsAndTruckersSkills from './loadDevsAndTruckersSkills';
// import loadSingleAxisSimilarity from './singleAxisSimilarity';

let mobile = false;
let viewportWidth = window.innerWidth;
let isMobile = viewportWidth < 700? true : false

function resize() {}

function init() {

// Buttons for stepper progression
  const $TEMP_buttons_Container = d3.select('body').append('div.buttons-container')

  const $truckerCircle = $TEMP_buttons_Container.append('div.transition-button.trucker-circle').text('trucker')
  const $truckerCircleAutomation = $TEMP_buttons_Container.append('div.transition-button.trucker-circle-automatability').text('trucker automation')
  const $truckerDevAutomation = $TEMP_buttons_Container.append('div.transition-button.truckers-and-devs-automatability').text('truckers > developers?')
  const $truckerSkill = $TEMP_buttons_Container.append('div.transition-button.truckers-devs-trucker-skill').text('trucker skill')
  const $devSkill = $TEMP_buttons_Container.append('div.transition-button.truckers-devs-dev-skill').text('developer skill')


  const $skills_Two_Jobs = $TEMP_buttons_Container.append('div.transition-button.all-skills').text('AllSkills')
  const $skills_Difference_Two_Jobs = $TEMP_buttons_Container.append('div.transition-button.skill-difference').text('DifferenceInSkills')
  const $skills_Stack_Difference_Two_Jobs = $TEMP_buttons_Container.append('div.transition-button.skill-stack-difference').text('StackDifference')

  const $skills_Difference_All_Jobs = $TEMP_buttons_Container.append('div.transition-button.all-skills-difference').text('StackAllSkills')

  const $showScatterplot =$TEMP_buttons_Container.append('div.transition-button.final-scatter').text('showScatter')

  const $show_XY_Axes_Similarity_All_Jobs =$TEMP_buttons_Container.append('div.transition-button.automation-similarity-axis').text('XY Axes Similarity')
  const $show_Earnings_Comparison =$TEMP_buttons_Container.append('div.transition-button.earnings').text('Earnings')
  const $show_Number_Jobs_Available =$TEMP_buttons_Container.append('div.transition-button.jobs-available').text('Number of Jobs')



  $truckerCircle.on('click', ()=>loadIntro())

// Functions to progress piece
  $skills_Two_Jobs.on('click', ()=>loadDevsAndTruckersSkills())

  $showScatterplot.on('click',()=>loadScatterplot())
  // $single_Axis_Similarity_All_Jobs.on('click', ()=>loadSingleAxisSimilarity())

}

export default { init, resize };
