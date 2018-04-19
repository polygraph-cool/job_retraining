import loadScatterplot from './scatterplot';
import loadDevsAndTruckersSkills from './loadDevsAndTruckersSkills';

let mobile = false;
let viewportWidth = window.innerWidth;
let isMobile = viewportWidth < 700? true : false

function resize() {}

function init() {

  const buttonsContainer = d3.select('body').append('div.buttons-container')
  const skillsShowAll = buttonsContainer.append('div.transition-button.all-skills').text('AllSkills')
  const skillsShowDifference = buttonsContainer.append('div.transition-button.skill-difference').text('DifferenceInSkills')
  const skillsStackSkillDifference = buttonsContainer.append('div.transition-button.skill-stack-difference').text('StackDifference')
  const skillsAllDifferenceBars = buttonsContainer.append('div.transition-button.all-skills-difference').text('StackAllSkills')
  const showSingleAxisSimilarity =buttonsContainer.append('div.transition-button.only-similarity-axis').text('showSingleAxisSimilarity')

  const showScatterplot =buttonsContainer.append('div.transition-button.final-scatter').text('showScatter')

  skillsShowAll.on('click', ()=>loadDevsAndTruckersSkills())
  showScatterplot.on('click',()=>loadScatterplot())

  // loadScatterplot()

  // const buttonsContainer = d3.select('body').append('div.buttons-container')
  // const skillsShowAll = buttonsContainer.append('div.transition-button.all-skills').text('AllSkills')
  // const skillsShowDifference = buttonsContainer.append('div.transition-button.skill-difference').text('DifferenceInSkills')
  // const skillsStackSkillDifference = buttonsContainer.append('div.transition-button.skill-stack-difference').text('StackDifference')
  // const skillsAllDifferenceBars = buttonsContainer.append('div.transition-button.all-skills-difference').text('StackAllSkills')
  // const showSingleAxisSimilarity =buttonsContainer.append('div.transition-button.only-similarity-axis').text('showSingleAxisSimilarity')
  //
  // const showScatterplot =buttonsContainer.append('div.transition-button.final-scatter').text('showScatter')
  //
  // skillsShowAll.on('click', ()=>loadDevsAndTruckersSkills())
  // showScatterplot.on('click'()=>loadScatterplot())

}

export default { init, resize };
